#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import sys, os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
from numpy import expand_dims
from numpy import amax
from mrcnn.config import Config
from mrcnn.model import MaskRCNN
from mrcnn.model import mold_image
from skimage.io import imread as sk_imread
from cv2 import INTER_AREA
from cv2 import resize as cv2_resize
from cv2 import imwrite as cv2_imwrite
from sqlite3 import connect

# define the prediction configuration
class PredictionConfig(Config):
    # define the name of the configuration
    NAME = "headstone_cfg"
    # number of classes (background + kangaroo)
    NUM_CLASSES = 1 + 1
    # simplify GPU config
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1

def load_model():
    #Load Prediction config
    cfg = PredictionConfig()
    # define the model
    model = MaskRCNN(mode='inference', model_dir='./', config=cfg)
    # load model weights
    model_path = 'model_weights.h5'
    model.load_weights(model_path, by_name=True)
    return model, cfg

def load_image(file):
    # Load image
    orig = sk_imread(file)
    
    #resize the image so largest dimension is no more than 500px
    scale = min(1, 275/amax(orig.shape))
    width, height = int(orig.shape[0]*scale), int(orig.shape[1]*scale)
    image = cv2_resize(orig, (height, width), interpolation=INTER_AREA)
    
    return image, orig, width/orig.shape[0]    

def predict_bb(image, model, cfg, tol=.995):
    # convert pixel values (e.g. center)
    scaled_image = mold_image(image, cfg)
    # convert image into one sample
    sample = expand_dims(scaled_image, 0)

    # make prediction
    detect = model.detect(sample, verbose=0)
    yhat = detect[0]
    
    #check accuracy and size
    img_size = image.shape[0] * image.shape[1]
    result, size = None, 0
    for score, roi in zip(yhat['scores'], yhat['rois']):
        if score > tol:
            y1, x1, y2, x2 = roi
            cur_size = (y2-y1)*(x2-x1)
            if cur_size/img_size > .1 and (cur_size > size or result is None):
                result, size = roi, cur_size

    return result

def crop(image, rect, scale):
    y1, x1, y2, x2 = rect
    y1, x1, y2, x2 = int(y1/scale), int(x1/scale), int(y2/scale), int(x2/scale)
    return image[y1:y2,x1:x2,:]

def log(result_list, db):
    #connect to db
    conn = connect(db)
    c = conn.cursor()
    #initialize CROPPING_RESULT table if not exists
    c.execute('''CREATE TABLE IF NOT EXISTS PipelineResults(
                    orig_path text UNIQUE,
                    crop_path text UNIQUE, 
                    crop_success integer,
                    ocr_results text,
                    confidence text)''')
    #log results
    c.executemany('insert into PipelineResults(orig_path, crop_path, crop_success) values (?,?,?)', result_list)
    conn.commit()
    #close out db
    c.close()
    
def crop_images(input_dir, output_dir, database, padding=0, tol=.995):
    #Load pre-trained model
    model, cfg = load_model()  
    
    #set paths
    ipath = lambda x : f'{input_dir}/{x}'
    opath = lambda x : f'{output_dir}/{x}'
    
    # Go through all images
    result_list = []
    for file in os.listdir(input_dir):
        #load images
        testing, orig, scale = load_image(ipath(file))
        
        #predict on testing
        rect = predict_bb(testing, model, cfg)
        
        #check if we failed
        if rect is None:
            #failure
            result= (ipath(file), ipath(file), 0)
        else:
            #crop the image
            cropped = crop(orig, rect, scale)
            
            #write to cropped dir
            cv2_imwrite(opath(file),cropped)
            
            #success
            result=(ipath(file), opath(file), 1)
        
        #append result for logging later
        result_list.append(result)
    #log result in db
    log(result_list, database)    

if __name__ == "__main__":
    crop_images(sys.argv[1], sys.argv[2], sys.argv[3])
