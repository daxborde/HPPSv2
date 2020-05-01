from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os, os.path
import re
import sys
import tarfile
import copy
import sys

os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
#os.environ["CUDA_VISIBLE_DEVICES"] = "0"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '4'

import textwrap
import numpy as np
from six.moves import urllib
import tensorflow as tf
from PIL import Image, ImageDraw, ImageFont


from text_recognition import TextRecognition
from text_detection import TextDetection

from util import *
from shapely.geometry import Polygon, MultiPoint
from shapely.geometry.polygon import orient
from skimage import draw

#from werkzeug import secure_filename
from subprocess import call
# from sightengine.client import SightengineClient

FOND_PATH = './STXINWEI.TTF'

# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

def init_ocr_model(rec_path, det_path):
    detection_pb = det_path
    recognition_pb = rec_path
    with tf.device('/cpu:0'):

        tf_config = tf.ConfigProto(device_count = {'GPU': 0}, allow_soft_placement=True)

        detection_model = TextDetection(detection_pb, tf_config, max_size=1600)
        recognition_model = TextRecognition(recognition_pb, seq_len=27, config=tf_config)
    
    label_dict = np.load('./reverse_label_dict_with_rects.npy', allow_pickle = True)[()] # reverse_label_dict_with_rects.npy  reverse_label_dict
    return detection_model, recognition_model, label_dict 

def predict_ocr_image(img_dir, filename, save_dir, ocr_detection_model, ocr_recognition_model, ocr_label_dict):

    img_path = os.path.join(img_dir, filename)
    save_path = os.path.join(save_dir, filename)

    image, output = detection(img_path, ocr_detection_model, ocr_recognition_model, ocr_label_dict)
    cv2.imwrite(save_path, image)

    return output

from functools import reduce
import operator
import math

def order_points(pts):
    def centeroidpython(pts):
        x, y = zip(*pts)
        l = len(x)
        return sum(x) / l, sum(y) / l

    centroid_x, centroid_y = centeroidpython(pts)
    pts_sorted = sorted(pts, key=lambda x: math.atan2((x[1] - centroid_y), (x[0] - centroid_x)))
    return pts_sorted


def draw_annotation(image, points, label, horizon=True, vis_color=(255, 0, 0)):#(30,255,255)
    points = np.asarray(points)
    points = np.reshape(points, [-1, 2])
    cv2.polylines(image, np.int32([points]), 1, (255, 0, 0), 2)

    image = Image.fromarray(image)
    width, height = image.size
    fond_size = int(max(height, width)*0.03)
    FONT = ImageFont.truetype(FOND_PATH, fond_size, encoding='utf-8')
    DRAW = ImageDraw.Draw(image)

    points = order_points(points)
    if horizon:
        DRAW.text((points[0][0], max(points[0][1] - fond_size, 0)), label, vis_color, font=FONT)
    else:
        lines = textwrap.wrap(label, width=1)
        y_text = points[0][1]
        for line in lines:
            width, height = FONT.getsize(line)
            DRAW.text((max(points[0][0] - fond_size, 0), y_text), line, vis_color, font=FONT)
            y_text += height
    image = np.array(image)
    return image


def poly2mask(vertex_row_coords, vertex_col_coords, shape):
    fill_row_coords, fill_col_coords = draw.polygon(vertex_row_coords, vertex_col_coords, shape)
    mask = np.zeros(shape, dtype=np.bool)
    mask[fill_row_coords, fill_col_coords] = True
    return mask


def mask_with_points(points, h, w):
    vertex_row_coords = [point[1] for point in points]  # y
    vertex_col_coords = [point[0] for point in points]

    mask = poly2mask(vertex_row_coords, vertex_col_coords, (h, w))  # y, x
    mask = np.float32(mask)
    mask = np.expand_dims(mask, axis=-1)
    bbox = [np.amin(vertex_row_coords), np.amin(vertex_col_coords), np.amax(vertex_row_coords),
            np.amax(vertex_col_coords)]
    bbox = list(map(int, bbox))
    return mask, bbox


def detection(img_path, detection_model, recognition_model, label_dict, it_is_video=False):
    if it_is_video:
        bgr_image = img_path
    else:
        bgr_image = cv2.imread(img_path)

    vis_image = copy.deepcopy(bgr_image)
    rgb_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)

    r_boxes, polygons, scores = detection_model.predict(bgr_image)

    words = []
    confidences = []

    for r_box, polygon, score in zip(r_boxes, polygons, scores):
        mask, bbox = mask_with_points(polygon, vis_image.shape[0], vis_image.shape[1])
        masked_image = rgb_image * mask
        masked_image = np.uint8(masked_image)
        cropped_image = masked_image[max(0, bbox[0]):min(bbox[2], masked_image.shape[0]),
                        max(0, bbox[1]):min(bbox[3], masked_image.shape[1]), :]

        height, width = cropped_image.shape[:2]
        test_size = 299
        if height >= width:
            scale = test_size / height
            resized_image = cv2.resize(cropped_image, (0, 0), fx=scale, fy=scale)
            #print(resized_image.shape)
            left_bordersize = (test_size - resized_image.shape[1]) // 2
            right_bordersize = test_size - resized_image.shape[1] - left_bordersize
            image_padded = cv2.copyMakeBorder(resized_image, top=0, bottom=0, left=left_bordersize,
                                              right=right_bordersize, borderType=cv2.BORDER_CONSTANT, value=[0, 0, 0])
            image_padded = np.float32(image_padded) / 255.
        else:
            scale = test_size / width
            resized_image = cv2.resize(cropped_image, (0, 0), fx=scale, fy=scale)
            #print(resized_image.shape)
            top_bordersize = (test_size - resized_image.shape[0]) // 2
            bottom_bordersize = test_size - resized_image.shape[0] - top_bordersize
            image_padded = cv2.copyMakeBorder(resized_image, top=top_bordersize, bottom=bottom_bordersize, left=0,
                                              right=0, borderType=cv2.BORDER_CONSTANT, value=[0, 0, 0])
            image_padded = np.float32(image_padded) / 255.

        image_padded = np.expand_dims(image_padded, 0)

        results, probs = recognition_model.predict(image_padded, label_dict, EOS='EOS')

        results = ''.join(results).replace('#', '')

        words.append(''.join(results))
        confidences.append(sum(probs) / len(probs))

        ccw_polygon = orient(Polygon(polygon.tolist()).simplify(5, preserve_topology=True), sign=1.0)
        pts = list(ccw_polygon.exterior.coords)[:-1]
        vis_image = draw_annotation(vis_image, pts, ''.join(results))

    retval = (' '.join(words), ' '.join([str(c) for c in confidences]), img_path)

    return vis_image, retval

from time import time

from sqlite3 import connect

def update(db, pipeline_output):

    # connect to db
    conn = connect(db)
    c = conn.cursor()

    # update cropped images to include OCR output
    
    for output in pipeline_output:
        c.execute(f'Update PipelineResults set ocr_results = "{output[0]}", confidence = "{output[1]}" where crop_path = "{output[2]}"')
        conn.commit()

    c.close()

import logging
from optparse import OptionParser

if __name__ == '__main__':
    '''
    parser = ArgumentParser()

    parser.add_argument('--img_dir', type = str, help = 'Path to directory of images.', default = './image/')
    parser.add_argument('--db', type = str, help = 'Path to SQLite database file.')
    parser.add_argument('--recognition_model_path', type = str, help = 'Path to the trained model (.pb) file.', default = './checkpoint/text_recognition.pb')
    parser.add_argument('--detection_model_path', type = str, help = 'Path to the trained detection model (.pb) file.', default = './checkpoint/ICDAR_0.7.pb')

    args = parser.parse_args()
    '''

    os.makedirs('logs', exist_ok = True)
    logging.basicConfig(filename = "logs/ocr.log", level = logging.DEBUG, format = "%(levelname)s: %(message)s")

    if len(sys.argv) == 4:
        try:
            img_dir = sys.argv[1]
            db_path = sys.argv[2]
            project_path = sys.argv[3]
        except:
            logging.error("One or more arguments missing. Make sure you've supplied a valid image directory, database path, and project folder.")
            sys.exit()
    
    else:
        img_dir = "./image/"
        db_path = None

    rec_model_path = "text_recognition.pb"
    det_model_path = "ICDAR_0.7.pb"

    ocr_detection_model, ocr_recognition_model, ocr_label_dict = init_ocr_model(rec_model_path, det_model_path)

    vis_save_dir = os.path.join(project_path, "ocr_output", "")

    os.makedirs(vis_save_dir, exist_ok = True)

    db_output = []

    logging.info("Started processing current batch...")
    start = time()

    for filename in os.listdir(img_dir):
        try:
            ocr_output = predict_ocr_image(img_dir, filename, vis_save_dir, ocr_detection_model, ocr_recognition_model, ocr_label_dict)
            db_output.append(ocr_output)
            logging.info("Successfully processed: {}. Results: {}".format(filename, ocr_output[0]))
        
        except:
            logging.error("Something went wrong when processing the file '{}'. Ensure you've supplied the proper filepath or that the file is an image and try again.".format(filename))

    duration = time() - start

    logging.info("Finished processing current image set. Time taken: {0:.2f}s".format(duration))

    update(db_path, db_output)