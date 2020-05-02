## Installation and Setup

### Installing crop_images

Use the latest pyinstaller from https://github.com/pyinstaller/pyinstaller

Requirements:
```
tensorflow=1.13.2
keras=2.2.5
scikit-image
mask-rcnn (https://github.com/matterport/Mask_RCNN)
```

`pyinstaller -F crop_images.py --hidden-imports=tensorflow_core.python`


### OCR Module Build Setup

1. Install `pyinstaller` using the following command:

`pip install git+https://github.com/pyinstaller/pyinstaller.git@b944f98774e1ecd9d58e0628f52e5b9f2d9dad5d`

2. Create conda environments corresponding to the version you wish to set up (CPU or GPU):

#### CPU

```
conda create -f cpu-environment.yml`
```

In the event that this fails to create a conda environment, or if any packages are missing, you may have to create the environment from scratch by installing each of the dependencies under `dependencies` in `cpu-environment.yml`, like so:

```
conda create -n attention_ocr python=3.6
conda install <package_name>
conda install <package_name>==<version>
.
.
.
```

If there are other packages missing, you may also try installing using the full package list:

```
conda create -f cpu-environment-full.yml
```

#### GPU

```
conda create -f gpu-environment.yml
```

Similarly, if this results in a failed conda environment, or in missing packages, try manually installing them:

```
conda create -n attention_ocr python=3.6
conda install <package_name>
conda install <package_name>==<version>
.
.
.
```

As a last resort, you can also install the full package list:

```
conda create -f gpu-environment-full.yml
```

Note that the only major difference is the use of `tensorflow-gpu` in leiu of the CPU version's `tensorflow-mkl`.

Once created, activate the conda environment.

```
conda activate attention_ocr
```

3. Download the following files and place them in the same directory as `ocr_predict.py` or `ocr_predict_gpu.py` (if working outside this repo only; the latter two are already included):

* Pre-trained [text detection](https://drive.google.com/file/d/1DxiKofagtF9RrzBg9b5ZKbMs66uxglhA/view?usp=sharing) and [text recognition](https://drive.google.com/file/d/1vLic2xkbZAhDJAIyWV4UV0o5rY7tLKev/view?usp=sharing) models from [AttentionOCR](https://github.com/zhang0jhon/AttentionOCR)
* [Compatible Fonts file](https://drive.google.com/file/d/1nOBpqEHtAq4FYt7dhN5T3anYs78zr4c1/view?usp=sharing)
* [Label dictionary file](https://drive.google.com/file/d/1vzIkaQjVBibNnGiPfcce3H9yN7Q9bZ-C/view?usp=sharing)


### Running the OCR module

Run the OCR using the following command:

CPU:

```
python ocr_predict.py path_to_image_folder path_to_db.sqlite3
```

GPU:

```
python ocr_predict_gpu.py path_to_image_folder path_to_db.sqlite3
```

OCR output will be printed in the logs at `logs/ocr.log`, and annotations are available in `ocr_output` in the image directory you've specified.

Either script can also be run without a database by supplying no command-line arguments, but this requires all images be in `./image/`; that is, a folder `image` in the same directory as the script. Annotations will now instead be in `image/ocr_output/`.

## Packaged Installers (Windows)

GPU: https://drive.google.com/file/d/1tabrGq68dJuURxJR_vou7J0T9N4Y98vQ/view?usp=sharing

CPU: https://drive.google.com/file/d/13YebPlS-tRe4l0ORMfLnC5YFld6WTRDH/view?usp=sharing
