import os, sys
import numpy as np
import time

# sys.path.append('/data/zhangjinjin/icdar2019/LSVT/MaskRCNN')

import tensorflow as tf
from matplotlib import pyplot as plt
import matplotlib.gridspec as gridspec
import textwrap
import cv2

from util import *

class TextDetection(object):
    def __init__(self, pb_file, config, max_size):
        self.pb_file = pb_file
        self.config = config
        self.init_model()
        self.max_size = max_size
        
    def init_model(self):
        self.graph = tf.Graph()
        with self.graph.as_default():
            with tf.gfile.FastGFile(self.pb_file, 'rb') as f:
                graph_def = tf.GraphDef()
                graph_def.ParseFromString(f.read())
                _ = tf.import_graph_def(graph_def, name='')
        
        
        self.sess = tf.Session(graph=self.graph, config=self.config)
        
        self.img_ph = self.sess.graph.get_tensor_by_name('image:0')
        self.boxes_ph = self.sess.graph.get_tensor_by_name('output/boxes:0')
        self.scores_ph = self.sess.graph.get_tensor_by_name('output/scores:0')
        self.labels_ph = self.sess.graph.get_tensor_by_name('output/labels:0')
        self.masks_ph = self.sess.graph.get_tensor_by_name('output/masks:0')
        
    def predict(self, bgr_image):
        orig_shape = bgr_image.shape[:2]
        
        resizer = CustomResize(self.max_size, self.max_size)
        resized_img = resizer.augment(bgr_image)
        scale = np.sqrt(resized_img.shape[0] * 1.0 / bgr_image.shape[0] * resized_img.shape[1] / bgr_image.shape[1])
        
        boxes, scores, labels, masks = self.sess.run([self.boxes_ph, self.scores_ph, self.labels_ph, self.masks_ph], \
                feed_dict={self.img_ph: resized_img})
                
        boxes = boxes / scale
        # boxes are already clipped inside the graph, but after the floating point scaling, this may not be true any more.
        boxes = clip_boxes(boxes, orig_shape)
        
        full_masks = [paste_mask(box, mask, orig_shape) for box, mask in zip(boxes, masks)]
        masks = full_masks
        
        polygons = []    
        r_boxes = []
        for box, mask in zip(boxes, masks):
            r_box, polygon = generate_polygon(mask, box)
            polygons.append(polygon)
            r_boxes.append(r_box)
                
        return r_boxes, polygons, scores
    
    def find_best_size(self, boxes, probs, threshold=0.9):
        """
        Compute best scale for test.

        Args:
            boxes: predicted boxes.
            probs: probs corresponding to boxes.
        Returns:
            shortest_edge for test.
        """
        # filter high confidence boxes.
        thre_masks = probs>threshold
        length = np.sum(thre_masks)

        if length > 0:
            sqrt_areas = []
            levels = []
            shortest_edges = []
            boxes = boxes[thre_masks]

            for box in boxes:
                x0, y0, x1, y1 = box #map(int, box)
                w = x1 - x0
                h = y1 - y0

                sqrtarea = np.sqrt(w*h)
                level = np.floor(4 + np.log( (sqrtarea * (1. / 224) + 1e-6) * (1.0 / np.log(2)) ))
                # print(w, h, sqrtarea, level)
                sqrt_areas.append(sqrtarea)
                levels.append(level)
                shortest_edges.append(min(w, h))

            counts = np.bincount(levels)
            most_level = np.argmax(counts)
            max_level = np.amax(levels)
            min_level = np.amin(levels)
            # print("sqrt_areas: {}, levels: {}, shortest_edges: {}".format(sqrt_areas, levels, shortest_edges))
            # print("area mean: {}, median: {}, std: {}".format(np.mean(sqrt_areas), np.median(sqrt_areas), np.std(sqrt_areas)))
            # print("shortest edge mean: {}, median: {}, std: {}".format(np.mean(shortest_edges), np.median(shortest_edges), np.std(shortest_edges)))
            print("levels: {}".format(levels))
            print("fpn level max: {}, min: {}, most: {}".format(np.amax(levels), np.amin(levels), most_level))

            if most_level==1:
                max_size= 2240
            elif most_level==2:
                max_size = 1920
            elif most_level==5:
                max_size = 1280
        return max_size

    def adaptive_predict(self, bgr_image):
        orig_shape = bgr_image.shape[:2]
        
        resizer = CustomResize(self.max_size, self.max_size)
        resized_img = resizer.augment(bgr_image)
        scale = np.sqrt(resized_img.shape[0] * 1.0 / bgr_image.shape[0] * resized_img.shape[1] / bgr_image.shape[1])
        boxes, scores, labels, masks = self.sess.run([self.boxes_ph, self.scores_ph, self.labels_ph, self.masks_ph], \
                feed_dict={self.img_ph: resized_img})
        
        self.max_size = self.find_best_size(boxes, scores)
        if test_short_edge_size==TEST_SHORT_EDGE_SIZE:
            pass
        else:
            resizer = CustomResize(self.max_size, self.max_size)
            resized_img = resizer.augment(bgr_image)
            scale = np.sqrt(resized_img.shape[0] * 1.0 / bgr_image.shape[0] * resized_img.shape[1] / bgr_image.shape[1])
            boxes, scores, labels, masks = self.sess.run([self.boxes_ph, self.scores_ph, self.labels_ph, self.masks_ph], \
                feed_dict={self.img_ph: resized_img})

        boxes = boxes / scale
        # boxes are already clipped inside the graph, but after the floating point scaling, this may not be true any more.
        boxes = clip_boxes(boxes, orig_shape)
        
        full_masks = [paste_mask(box, mask, orig_shape) for box, mask in zip(boxes, masks)]
        masks = full_masks
        
        polygons = []    
        r_boxes = []
        for box, mask in zip(boxes, masks):
            r_box, polygon = generate_polygon(mask, box)
            polygons.append(polygon)
            r_boxes.append(r_box)
                
        return r_boxes, polygons, scores