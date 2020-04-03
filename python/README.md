### Installing crop_images

Use the latest pyinstaller from https://github.com/pyinstaller/pyinstaller

Requirements:
```
tensorflow=1.13.2
keras=2.2.5
scikit-image
opencv
mask-rcnn (https://github.com/matterport/Mask_RCNN)
```

`pyinstaller -F crop_images.py --hidden-imports=tensorflow_core.python`
