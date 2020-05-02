import cv2
import numpy as np

import tensorflow as tf

from tensorpack.utils import viz
from tensorpack.utils.palette import PALETTE_RGB
from tensorpack.dataflow.imgaug import transform

#import pycocotools.mask as cocomask
from skimage import measure
from skimage.measure import find_contours
import matplotlib.pyplot as plt
from matplotlib import patches,  lines
from matplotlib.patches import Polygon

import os
import sys
import random
import itertools
import colorsys
from PIL import Image, ImageDraw, ImageFont

def draw_class(image, label, point, vis_color=(255, 255, 255)):
    image = Image.fromarray(image)
    width, height = image.size
    fond_size = int(max(height, width)*0.03)
    FONT = ImageFont.truetype('/data/zhangjinjin/icdar2019/LSVT/full/STXINWEI.TTF', fond_size, encoding='utf-8')
    DRAW = ImageDraw.Draw(image)

    DRAW.text((point[0], max(point[1] - fond_size, 0)), label, vis_color, font=FONT)
    image = np.array(image)
    return image

def get_keypoints():
    """Get the COCO keypoints and their left/right flip coorespondence map."""
    # Keypoints are not available in the COCO json for the test split, so we
    # provide them here.
    keypoints = [
        'nose',
        'left_eye',
        'right_eye',
        'left_ear',
        'right_ear',
        'left_shoulder',
        'right_shoulder',
        'left_elbow',
        'right_elbow',
        'left_wrist',
        'right_wrist',
        'left_hip',
        'right_hip',
        'left_knee',
        'right_knee',
        'left_ankle',
        'right_ankle'
    ]
    keypoint_flip_map = {
        'left_eye': 'right_eye',
        'left_ear': 'right_ear',
        'left_shoulder': 'right_shoulder',
        'left_elbow': 'right_elbow',
        'left_wrist': 'right_wrist',
        'left_hip': 'right_hip',
        'left_knee': 'right_knee',
        'left_ankle': 'right_ankle'
    }
    return keypoints, keypoint_flip_map

def colormap(rgb=False):
    color_list = np.array(
        [
            0.000, 0.447, 0.741,
            0.850, 0.325, 0.098,
            0.929, 0.694, 0.125,
            0.494, 0.184, 0.556,
            0.466, 0.674, 0.188,
            0.301, 0.745, 0.933,
            0.635, 0.078, 0.184,
            0.300, 0.300, 0.300,
            0.600, 0.600, 0.600,
            1.000, 0.000, 0.000,
            1.000, 0.500, 0.000,
            0.749, 0.749, 0.000,
            0.000, 1.000, 0.000,
            0.000, 0.000, 1.000,
            0.667, 0.000, 1.000,
            0.333, 0.333, 0.000,
            0.333, 0.667, 0.000,
            0.333, 1.000, 0.000,
            0.667, 0.333, 0.000,
            0.667, 0.667, 0.000,
            0.667, 1.000, 0.000,
            1.000, 0.333, 0.000,
            1.000, 0.667, 0.000,
            1.000, 1.000, 0.000,
            0.000, 0.333, 0.500,
            0.000, 0.667, 0.500,
            0.000, 1.000, 0.500,
            0.333, 0.000, 0.500,
            0.333, 0.333, 0.500,
            0.333, 0.667, 0.500,
            0.333, 1.000, 0.500,
            0.667, 0.000, 0.500,
            0.667, 0.333, 0.500,
            0.667, 0.667, 0.500,
            0.667, 1.000, 0.500,
            1.000, 0.000, 0.500,
            1.000, 0.333, 0.500,
            1.000, 0.667, 0.500,
            1.000, 1.000, 0.500,
            0.000, 0.333, 1.000,
            0.000, 0.667, 1.000,
            0.000, 1.000, 1.000,
            0.333, 0.000, 1.000,
            0.333, 0.333, 1.000,
            0.333, 0.667, 1.000,
            0.333, 1.000, 1.000,
            0.667, 0.000, 1.000,
            0.667, 0.333, 1.000,
            0.667, 0.667, 1.000,
            0.667, 1.000, 1.000,
            1.000, 0.000, 1.000,
            1.000, 0.333, 1.000,
            1.000, 0.667, 1.000,
            0.167, 0.000, 0.000,
            0.333, 0.000, 0.000,
            0.500, 0.000, 0.000,
            0.667, 0.000, 0.000,
            0.833, 0.000, 0.000,
            1.000, 0.000, 0.000,
            0.000, 0.167, 0.000,
            0.000, 0.333, 0.000,
            0.000, 0.500, 0.000,
            0.000, 0.667, 0.000,
            0.000, 0.833, 0.000,
            0.000, 1.000, 0.000,
            0.000, 0.000, 0.167,
            0.000, 0.000, 0.333,
            0.000, 0.000, 0.500,
            0.000, 0.000, 0.667,
            0.000, 0.000, 0.833,
            0.000, 0.000, 1.000,
            0.000, 0.000, 0.000,
            0.143, 0.143, 0.143,
            0.286, 0.286, 0.286,
            0.429, 0.429, 0.429,
            0.571, 0.571, 0.571,
            0.714, 0.714, 0.714,
            0.857, 0.857, 0.857,
            1.000, 1.000, 1.000
        ]
    ).astype(np.float32)
    color_list = color_list.reshape((-1, 3)) * 255
    if not rgb:
        color_list = color_list[:, ::-1]
    return color_list

def get_class_string(class_index, score, dataset):
    class_text = dataset.classes[class_index] if dataset is not None else \
        'id{:d}'.format(class_index)
    return class_text + ' {:0.2f}'.format(score).lstrip('0')


def vis_mask(img, mask, col, alpha=0.4, show_border=True, border_thick=1):
    """Visualizes a single binary mask."""

    img = img.astype(np.float32)
    idx = np.nonzero(mask)

    img[idx[0], idx[1], :] *= 1.0 - alpha
    img[idx[0], idx[1], :] += alpha * col

    if show_border:
        _, contours, _ = cv2.findContours(
            mask.copy(), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
        cv2.drawContours(img, contours, -1, _WHITE, border_thick, cv2.LINE_AA)

    return img.astype(np.uint8)


def vis_class(img, pos, class_str, font_scale=0.35):
    """Visualizes the class."""
    img = img.astype(np.uint8)
    x0, y0 = int(pos[0]), int(pos[1])
    # Compute text size.
    txt = class_str
    font = cv2.FONT_HERSHEY_SIMPLEX
    ((txt_w, txt_h), _) = cv2.getTextSize(txt, font, font_scale, 1)
    # Place text background.
    back_tl = x0, y0 - int(1.3 * txt_h)
    back_br = x0 + txt_w, y0
    cv2.rectangle(img, back_tl, back_br, _GREEN, -1)
    # Show text.
    txt_tl = x0, y0 - int(0.3 * txt_h)
    cv2.putText(img, txt, txt_tl, font, font_scale, _GRAY, lineType=cv2.LINE_AA)
    return img


def vis_bbox(img, bbox, thick=1):
    """Visualizes a bounding box."""
    img = img.astype(np.uint8)
    (x0, y0, w, h) = bbox
    x1, y1 = int(x0 + w), int(y0 + h)
    x0, y0 = int(x0), int(y0)
    cv2.rectangle(img, (x0, y0), (x1, y1), _GREEN, thickness=thick)
    return img


def vis_keypoints(img, kps, kp_thresh=2, alpha=0.7):
    """Visualizes keypoints (adapted from vis_one_image).
    kps has shape (4, #keypoints) where 4 rows are (x, y, logit, prob).
    """
    dataset_keypoints, _ = keypoint_utils.get_keypoints()
    kp_lines = kp_connections(dataset_keypoints)

    # Convert from plt 0-1 RGBA colors to 0-255 BGR colors for opencv.
    cmap = plt.get_cmap('rainbow')
    colors = [cmap(i) for i in np.linspace(0, 1, len(kp_lines) + 2)]
    colors = [(c[2] * 255, c[1] * 255, c[0] * 255) for c in colors]

    # Perform the drawing on a copy of the image, to allow for blending.
    kp_mask = np.copy(img)

    # Draw mid shoulder / mid hip first for better visualization.
    mid_shoulder = (
        kps[:2, dataset_keypoints.index('right_shoulder')] +
        kps[:2, dataset_keypoints.index('left_shoulder')]) / 2.0
    sc_mid_shoulder = np.minimum(
        kps[2, dataset_keypoints.index('right_shoulder')],
        kps[2, dataset_keypoints.index('left_shoulder')])
    mid_hip = (
        kps[:2, dataset_keypoints.index('right_hip')] +
        kps[:2, dataset_keypoints.index('left_hip')]) / 2.0
    sc_mid_hip = np.minimum(
        kps[2, dataset_keypoints.index('right_hip')],
        kps[2, dataset_keypoints.index('left_hip')])
    nose_idx = dataset_keypoints.index('nose')
    if sc_mid_shoulder > kp_thresh and kps[2, nose_idx] > kp_thresh:
        cv2.line(
            kp_mask, tuple(mid_shoulder), tuple(kps[:2, nose_idx]),
            color=colors[len(kp_lines)], thickness=2, lineType=cv2.LINE_AA)
    if sc_mid_shoulder > kp_thresh and sc_mid_hip > kp_thresh:
        cv2.line(
            kp_mask, tuple(mid_shoulder), tuple(mid_hip),
            color=colors[len(kp_lines) + 1], thickness=2, lineType=cv2.LINE_AA)

    # Draw the keypoints.
    for l in range(len(kp_lines)):
        i1 = kp_lines[l][0]
        i2 = kp_lines[l][1]
        p1 = kps[0, i1], kps[1, i1]
        p2 = kps[0, i2], kps[1, i2]
        if kps[2, i1] > kp_thresh and kps[2, i2] > kp_thresh:
            cv2.line(
                kp_mask, p1, p2,
                color=colors[l], thickness=2, lineType=cv2.LINE_AA)
        if kps[2, i1] > kp_thresh:
            cv2.circle(
                kp_mask, p1,
                radius=3, color=colors[l], thickness=-1, lineType=cv2.LINE_AA)
        if kps[2, i2] > kp_thresh:
            cv2.circle(
                kp_mask, p2,
                radius=3, color=colors[l], thickness=-1, lineType=cv2.LINE_AA)

    # Blend the keypoints.
    return cv2.addWeighted(img, 1.0 - alpha, kp_mask, alpha, 0)


def vis_one_image_opencv(
        im, boxes, segms=None, keypoints=None, thresh=0.9, kp_thresh=2,
        show_box=False, dataset=None, show_class=False):
    """Constructs a numpy array with the detections visualized."""

    if boxes is None or boxes.shape[0] == 0 or max(boxes[:, 4]) < thresh:
        return im

    if segms is not None and len(segms) > 0:
        masks = cocomask.decode(segms)
        color_list = colormap()
        mask_color_id = 0

    # Display in largest to smallest order to reduce occlusion
    areas = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
    sorted_inds = np.argsort(-areas)

    for i in sorted_inds:
        bbox = boxes[i, :4]
        score = boxes[i, -1]
        if score < thresh:
            continue

        # show box (off by default)
        if show_box:
            im = vis_bbox(
                im, (bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]))

        # show class (off by default)
        if show_class:
            class_str = get_class_string(classes[i], score, dataset)
            im = vis_class(im, (bbox[0], bbox[1] - 2), class_str)

        # show mask
        if segms is not None and len(segms) > i:
            color_mask = color_list[mask_color_id % len(color_list), 0:3]
            mask_color_id += 1
            im = vis_mask(im, masks[..., i], color_mask)

        # show keypoints
        if keypoints is not None and len(keypoints) > i:
            im = vis_keypoints(im, keypoints[i], kp_thresh)

    return im

def apply_mask(image, mask, color, alpha=0.5):
    """Apply the given mask to the image.
    """
    for c in range(3):
        image[:, :, c] = np.where(mask == 1,
                                  image[:, :, c] *
                                  (1 - alpha) + alpha * color[c] * 255,
                                  image[:, :, c])
    return image

def random_colors(N, bright=True):
    """
    Generate random colors.
    To get visually distinct colors, generate them in HSV space then
    convert to RGB.
    """
    brightness = 1.0 if bright else 0.7
    hsv = [(i / N, 1, brightness) for i in range(N)]
    colors = list(map(lambda c: colorsys.hsv_to_rgb(*c), hsv))
    random.shuffle(colors)
    return colors

def viz_instances(image, boxes, masks, class_ids, class_names,
                      scores=None, threshold=0.7, title="",
                      figsize=(12, 12), ax=None,
                      show_mask=True, show_bbox=True,
                      colors=None, captions=None):
    """
    boxes: [num_instance, (y1, x1, y2, x2, class_id)] in image coordinates.
    masks: [height, width, num_instances]
    class_ids: [num_instances]
    class_names: list of class names of the dataset
    scores: (optional) confidence scores for each box
    title: (optional) Figure title
    show_mask, show_bbox: To show masks and bounding boxes or not
    figsize: (optional) the size of the image
    colors: (optional) An array or colors to use with each object
    captions: (optional) A list of strings to use as captions for each object
    """
    # Number of instances
    N = boxes.shape[0]

    # Generate random colors
    colors = colors or random_colors(N)

    # Show area outside image boundaries.
    height, width = image.shape[:2]

    # masked_image = image.astype(np.uint32).copy()
    for i in range(N):
        score = scores[i] if scores is not None else None
        if score<threshold:
            continue

        color = colors[i]

        # Bounding box
        if not np.any(boxes[i]):
            # Skip this instance. Has no bbox. Likely lost in image cropping.
            continue
        y1, x1, y2, x2 = boxes[i]
        if show_bbox:
            image = cv2.rectangle(image, (x1, y1), (x2, y2), color)

        # Label
        if not captions:
            class_id = class_ids[i]
            label = class_names[class_id]
            x = random.randint(x1, (x1 + x2) // 2)
            caption = "{}".format(label)
        else:
            caption = captions[i]

        #cv2.putText(image, caption, (x1, y1 + 8), cv2.FONT_HERSHEY_SIMPLEX, 5, (255,255,255), 10)
        image = draw_class(image, caption, (x1,y1))
        # ax.text(x1, y1 + 8, caption,
        #         color='w', size=11, backgroundcolor="none")

        # Mask
        mask = masks[:, :, i]
        if show_mask:
            image = apply_mask(image, mask, color)

    return image


def clip_boxes(boxes, window):
    """
    Args:
        boxes: nx4, xyxy
        window: [h, w]
    """
    boxes = np.maximum(boxes, 0.0)
    h, w = window
    m = np.array([w,h,w,h], np.float32)
    boxes = np.minimum(boxes, m)
    return boxes

def clip_points(points, box):
    x1, y1, x2, y2 = box
    points_x, points_y = points[:,0], points[:,1]
    
    points_x = np.maximum(np.minimum(points_x, x2), x1)
    points_y = np.maximum(np.minimum(points_y, y2), y1)
    
    return np.stack((points_x, points_y))

class CustomResize(transform.TransformAugmentorBase):
    """
    Try resizing the shortest edge to a certain number
    while avoiding the longest edge to exceed max_size.
    """

    def __init__(self, short_edge_length, max_size, interp=cv2.INTER_LINEAR):
        """
        Args:
            short_edge_length ([int, int]): a [min, max] interval from which to sample the
                shortest edge length.
            max_size (int): maximum allowed longest edge length.
        """
        super(CustomResize, self).__init__()
        if isinstance(short_edge_length, int):
            short_edge_length = (short_edge_length, short_edge_length)
        self._init(locals())

    def _get_augment_params(self, img):
        h, w = img.shape[:2]
        size = self.rng.randint(
            self.short_edge_length[0], self.short_edge_length[1] + 1)
        scale = size * 1.0 / min(h, w)
        if h < w:
            newh, neww = size, scale * w
        else:
            newh, neww = scale * h, size
        if max(newh, neww) > self.max_size:
            scale = self.max_size * 1.0 / max(newh, neww)
            newh = newh * scale
            neww = neww * scale
        neww = int(neww + 0.5)
        newh = int(newh + 0.5)
        return transform.ResizeTransform(h, w, newh, neww, self.interp)
    
def draw_mask(im, mask, alpha=0.5, color=None):
    """
    Overlay a mask on top of the image.

    Args:
        im: a 3-channel uint8 image in BGR
        mask: a binary 1-channel image of the same size
        color: if None, will choose automatically
    """
    if color is None:
        color = PALETTE_RGB[np.random.choice(len(PALETTE_RGB))][::-1]
    im = np.where(np.repeat((mask > 0)[:, :, None], 3, axis=2),
                  im * (1 - alpha) + color * alpha, im)
    im = im.astype('uint8')
    return im
    
def paste_mask(box, mask, shape):
    """
    Args:
        box: 4 float
        mask: MxM floats
        shape: h,w
    Returns:
        A uint8 binary image of hxw.
    """
    # int() is floor
    # box fpcoor=0.0 -> intcoor=0.0
    x0, y0 = list(map(int, box[:2] + 0.5))
    # box fpcoor=h -> intcoor=h-1, inclusive
    x1, y1 = list(map(int, box[2:] - 0.5))    # inclusive
    x1 = max(x0, x1)    # require at least 1x1
    y1 = max(y0, y1)

    w = x1 + 1 - x0
    h = y1 + 1 - y0

    # rounding errors could happen here, because masks were not originally computed for this shape.
    # but it's hard to do better, because the network does not know the "original" scale
    mask = (cv2.resize(mask, (w, h)) > 0.5).astype('uint8')
    ret = np.zeros(shape, dtype='uint8')
    ret[y0:y1 + 1, x0:x1 + 1] = mask
    return ret

def calIoU(candidateBound, groundTruthBound):
    cx1 = candidateBound[0]
    cy1 = candidateBound[1]
    cx2 = candidateBound[2]
    cy2 = candidateBound[3]

    gx1 = groundTruthBound[0]
    gy1 = groundTruthBound[1]
    gx2 = groundTruthBound[2]
    gy2 = groundTruthBound[3]

    carea = (cx2 - cx1) * (cy2 - cy1) 
    garea = (gx2 - gx1) * (gy2 - gy1) 

    x1 = max(cx1, gx1)
    y1 = max(cy1, gy1)
    x2 = min(cx2, gx2)
    y2 = min(cy2, gy2)
    w = max(0, x2 - x1)
    h = max(0, y2 - y1)
    area = w * h 

    iou = float(area) / (carea + garea - area)
    return iou

def find_largest_contour(contours):
    max_ind = 0
    max_area = 0
    for ind,c in enumerate(contours):
        if cv2.contourArea(c) > max_area:
            max_area = cv2.contourArea(c)
            max_ind = ind
    return max_ind

def is_useful_contour(contour, bbox, iou_threshold=0.6):
    (x, y, w, h) = cv2.boundingRect(contour)
    bbox_2 = [x, y, x+w, y+h]
    if calIoU(bbox, bbox_2) > iou_threshold:
        return True
    else:
        return False

def generate_rrect(mask, box):
    x1, y1, x2, y2 = box
    mask_int = mask.astype(np.uint8)
    _, contours, hierarchy = cv2.findContours(mask_int,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    r_box = np.array([[x1,y1],[x2,y1],[x2,y2],[x1,y2]])
    if len(contours) > 0:
        max_ind = find_largest_contour(contours)
        contour = contours[max_ind]
        if is_useful_contour(contour, box):
            rect = cv2.minAreaRect(contours[max_ind])
            r_box = np.int0(cv2.boxPoints(rect))
    return r_box

def generate_polygon(mask, box):
    x1, y1, x2, y2 = box
    mask_int = mask.astype(np.uint8)
    image, contours, hierarchy = cv2.findContours(mask_int,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    r_box = np.array([[x1,y1],[x2,y1],[x2,y2],[x1,y2]])
    polygon = np.array([[x1,y1],[x2,y1],[x2,y2],[x1,y2]])
    if len(contours) > 0:
        max_ind = find_largest_contour(contours)
        contour = contours[max_ind]
        #print(contour)
        if is_useful_contour(contour, box):
            rect = cv2.minAreaRect(contours[max_ind])
            r_box = np.int0(cv2.boxPoints(rect))
            r_box = np.reshape(r_box, [-1, 2])

            polygon = np.int0(contour)
            polygon = np.reshape(polygon, [-1, 2])

    return r_box, polygon
