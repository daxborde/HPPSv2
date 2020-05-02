# Headstone Photo Processing System
A Senior Design project created for Dr. Amy Giroux to facilitate the processing of headstone photos. Leveraging Convolutional Neural Networks (CNNs), this application automatically crops, rotates, and extracts text from images of headstones (optical character recognition, or OCR). The results are then automatically matched with the CSV annotation data provided by the user, then queued for manual review.

## Important User Notes
- All column names in CSV should have no spaces or dashes
- The first three columns in CSV should be GivenName, MiddleName, and Surname
- Pixel Border should not be left blank (For no padding, input 0)

## Quick start

Clone the repository
```bash
git clone --depth=1 git@github.com:jschr/electron-react-redux-boilerplate.git
```

Install dependencies
```bash
cd electron-react-redux-boilerplate
npm install
```

Development
```bash
npm run develop
```

## DevTools

Toggle DevTools:

* macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
* Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
* Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>


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
