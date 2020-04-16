from contextlib import redirect_stdout
with redirect_stdout(None):
    import sys, os, argparse
    from numpy import expand_dims
    from numpy import amax
    from numpy import rot90 as np_rot90
    from mrcnn.config import Config
    from mrcnn.model import MaskRCNN
    from mrcnn.model import mold_image
    from skimage.io import imread as sk_imread
    from skimage.io import imsave as sk_imsave
    from sqlite3 import connect

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

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
    try:
        image = sk_imread(file)
    except:
        return None
    
    return image   

def predict(image, model, cfg, tol=.995):
    #make a prediction
    result, score = predict_bb(image, model, cfg)
    rotate = 0
    
    #If the image is dramatically unsure, skip rotations
    min_tol = max(0, tol-(1-tol)*5)
    
    #take rotation model is most sure about
    if(result is None or (score > min_tol and score < tol)):
        #No images will be flipped, no need to test 180 rotation
        rotations = [np_rot90(image), np_rot90(image, 3)]
        count = [1,3]
        for rot,c in zip(rotations,count):
            #make the prediction
            result_r, score_r = predict_bb(rot, model, cfg)
            #replace if model is more sure of this rotation
            if(score_r > score):
                result, score = result_r, score_r
                rotate = c
    return result, rotate

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
    result, size, score_fin = None, 0, 0
    for score, roi in zip(yhat['scores'], yhat['rois']):
        if score > tol:
            y1, x1, y2, x2 = roi
            cur_size = (y2-y1)*(x2-x1)
            if cur_size > size or result is None:
                result, size, score_fin = roi, cur_size, score

    return result, score_fin

def crop(image, rect, padding):
    y1, x1, y2, x2 = rect
    #scale back up rectangle and add the padding
    y1 = max(y1 - padding, 0)
    x1 = max(x1 - padding, 0)
    y2 = min(y2 + padding, image.shape[0]-1)
    x2 = min(x2 + padding, image.shape[1]-1)
    return image[y1:y2,x1:x2,:]

def log(result_list, db):
    #connect to db
    conn = connect(db)
    c = conn.cursor()
    #initialize PipelineResults table if not exists
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

def crop_images(input_dir, output_dir, database, padding=0, logfile="logfile.txt", tol=.995):
    #Load pre-trained model
    with redirect_stdout(None):
        model, cfg = load_model()
    
    #set paths
    ipath = lambda x : os.path.join(input_dir, x)
    opath = lambda x : os.path.join(output_dir, x)
    
    #add failure path
    os.mkdir(os.path.join(output_dir, "failures"))
    failpath = lambda x : os.path.join(output_dir,"failures", x)
    
    #intialize counters
    file_count = len(os.listdir(input_dir))
    cur_file = 1
    
    #open log file
    logger = open(logfile, "w")
    
    # Go through all images
    result_list = []
    for file in os.listdir(input_dir):
        #load images
        image = load_image(ipath(file))
        
        #ensure image loaded correctly, continue if not
        if(image is None):
            logger.write(f"{cur_file}/{file_count}: {ipath(file)} not registering as an image, ignoring\n")
            cur_file+=1
            continue
        
        #predict on image
        rect, rotation = predict(image, model, cfg)
        
        #check if we failed
        if rect is None:
            #failure
            sk_imsave(failpath(file),image)
            result= (ipath(file), failpath(file), 0)
        else:
            #rotate the image
            image = np_rot90(image, rotation)
        
            #crop the image
            cropped = crop(image, rect, padding)

            #write to cropped dir
            sk_imsave(opath(file),cropped)
            
            #success
            result=(ipath(file), opath(file), 1)
        
        #append result for logging to database
        result_list.append(result)
        
        #log to logfile and stdout
        print(cur_file, file_count, result[0], result[1], result[2])
        logger.write(f"{cur_file}/{file_count}: {result[0]} {result[1]} {result[2]}\n")
        cur_file+=1
       
    #log result in db and close logger
    log(result_list, database)
    logger.close()
    

if __name__ == "__main__":
    # create default log file name
    logfile = "log.txt"
    
    #parse command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('input_dir', type=str, nargs=1)
    parser.add_argument('output_dir', type=str, nargs=1)
    parser.add_argument('database', type=str, nargs=1)
    parser.add_argument('--padding', type=int, nargs=1, default=[0])
    parser.add_argument('--log', type=str, nargs=1, default=[logfile])    
    args=parser.parse_args()
    
    #ensure paths are absolute and padding is > 0
    _input_dir = os.path.abspath(args.input_dir[0])
    _output_dir = os.path.abspath(args.output_dir[0])
    _database = os.path.abspath(args.database[0])
    _log = os.path.abspath(args.log[0])
    _padding = max(args.padding[0], 0)
    
    # run script
    crop_images(_input_dir, _output_dir, _database, padding=_padding, logfile=_log)
