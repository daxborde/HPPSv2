import os, sys
import numpy as np
import time

import tensorflow as tf
from matplotlib import pyplot as plt
import matplotlib.gridspec as gridspec
import textwrap
import cv2
import tensorflow as tf

from util import *

class TextRecognition(object):
    def __init__(self, pb_file, seq_len, config):
        self.pb_file = pb_file
        self.config = config
        self.seq_len = seq_len
        self.init_model()
        
    def init_model(self):
        self.graph = tf.Graph()
        with self.graph.as_default():
            with tf.gfile.FastGFile(self.pb_file, 'rb') as f:
                graph_def = tf.GraphDef()
                graph_def.ParseFromString(f.read())
                _ = tf.import_graph_def(graph_def, name='')
        
        
        self.sess = tf.Session(graph=self.graph, config=self.config)
        
        self.img_ph = self.sess.graph.get_tensor_by_name('image:0')
        self.is_training = self.sess.graph.get_tensor_by_name('is_training:0')
        self.dropout = self.sess.graph.get_tensor_by_name('dropout:0')
        self.preds = self.sess.graph.get_tensor_by_name('sequence_preds:0')
        self.probs = self.sess.graph.get_tensor_by_name('sequence_probs:0')
        
    def predict(self, image, label_dict, EOS='EOS'):
        results = []
        probabilities = []
        
        pred_sentences, pred_probs = self.sess.run([self.preds, self.probs], \
                    feed_dict={self.is_training: False, self.dropout: 1.0, self.img_ph: image})

        for char in pred_sentences[0]:
            if label_dict[char] == EOS:
                break
            results.append(label_dict[char])
        probabilities = pred_probs[0][:min(len(results)+1,self.seq_len)]
        
        return results, probabilities
  