# Headstone Photo Processing System

![GitHub](https://img.shields.io/github/license/daxborde/HPPSv2)
![David](https://img.shields.io/david/daxborde/HPPSv2)
![David](https://img.shields.io/david/dev/daxborde/HPPSv2)

## Description

A Senior Design project created for Dr. Amy Giroux to facilitate the processing of headstone photos.
Leveraging Convolutional Neural Networks (CNNs), this application automatically crops, rotates, and
extracts text from images of headstones (optical character recognition, or OCR). The results are
then automatically matched with the CSV annotation data provided by the user, then queued for manual
review.

### Built With

- Electron
- React
- Redux
- TensorFlow
- SQLite

## Important User Notes

- All column names in CSV should have no spaces or dashes
- The first three columns in CSV should be: Given, Middle, and Surname
- For no pixel border input 0 (default is 15)

## Packaged Distributions (Windows)

Our software comes in CPU and GPU varieties. For systems with no GPU, the CPU version must be used. For systems with a compatible NVIDIA GPU, using the GPU version is preferred for its quicker processing times on optical character recognition, but is not required.

CPU release: https://drive.google.com/file/d/1GoJxuTlsru9FqAaa7Qub7J5EFdmhn4KU/view?usp=sharing

GPU release: https://drive.google.com/file/d/1fvccGiqFG2NtMpkFvTj2pwJKxxvko87L/view?usp=sharing

Once downloaded, run the installer by double clicking it. Once installed, the application will open and be ready for use.

### Application Usage

#### Create a New Project

1. Upon startup, click "Create Project"

2. Specify a Project Location. This should be the (preferrably empty) folder in which the project contents and processed images will be stored. This can also be specified using the directory browser button next to the text field.

3. Specify a CSV file. This can be converted from Excel spreadsheets, and should adhere to the User Notes specified above prior to processing. This can also be specified using the directory browser button next to the text field.

4. Specify a Photos folder. This does not have to match the project folder, and all images should be in the root-level directory (i.e. no images in nested subfolders). This can also be specified using the directory browser button next to the text field.

5. Specify a Naming Pattern. This is the naming format you wish the renamed images to be in after processing. This is to be specified as a string delimited by `{}`, and should correspond to columns in the CSV file you provided. For example, to rename all images to the format of `firstName_middleInitial_lastName.ext` (where `.ext` is the original image's file extension), you would enter `{0}_{1}_{2}`; where the zeroth column of the CSV in this case contains the given (first) name, the first column contains the middle initial/name, and the second column contains the surname.

6. Specify a Pixel Padding Amount. This should be an integer greater than or to 0. If no value is provided, the padding value will default to 15 pixels.

7. Click "Finish". Processing of all images will then begin. Cropped images will be in the project directory you specified, and the results of the OCR module will be in the `ocr_output` folder within the project directory.

8. Once processing is complete, you will be greeted by a review page. This page displays an image and the best match to a row in the provided CSV. If some of the details are incorrect, you can either change all relavent text fields yourself, or supply the given (first), middle initial/name (if applicable), and surname found on the headstone, then click outside of the text box and press "j" to auto-fill the remaining fields. Pressing either of the arrow buttons on the bottom right of the window will rename the image.

#### Open an Existing Project

Projects that have completed processing can also be re-opened later for continued manual reviewing. On the startup page, click "Open Project" and navigate to the project directory you specified when creating the project, then begin manual review.

## Quick start (Development)

Clone the repository

```bash
git clone https://github.com/daxborde/HPPSv2.git
```

Install dependencies

```bash
cd HPPSv2
npm install
```

Development

```bash
npm run develop
```

## DevTools

Toggle DevTools:

- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## Packaging

Modify [electron-builder.yml](./electron-builder.yml) to edit package info.

For a full list of options see: https://github.com/electron-userland/electron-builder/wiki/Options.

Create a package for macOS, Windows or Linux using one of the following commands:

```
npm run pack:mac
npm run pack:win
npm run pack:linux
```

## Maintainers

- [@daxborde](https://github.com/daxborde)
- [@afranco20](https://github.com/afranco20)
- [@minhp4801](https://github.com/minhp4801)
- [@kobeeraveendran](https://github.com/kobeeraveendran)
- [@sschilke](https://github.com/sschilke)

## License

[MIT](https://choosealicense.com/licenses/mit/)
