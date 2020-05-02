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

## Quick start

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
