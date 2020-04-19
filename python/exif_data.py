 
#!/usr/bin/env python3
"""
Embed metadata into image
"""

__author__ = "Alex Franco"
__version__ = "0.1.0"
__license__ = "MIT"


def main(args):
    from json import loads as json_loads
    import piexif

    # create backup of original image
    # if args.output == None:
    # copyfile(args.input, f"{args.input}.bak")

    # create data
    zeroth_ifd = {}
    exif_ifd = {
        piexif.ExifIFD.UserComment:
            bytes(f'ASCII\x00\x00\x00{str(json_loads(args.metadata))}', 'utf-8')
    }
    gps_ifd = {}

    # create exif bytecode from data
    exif_dict = {"0th": zeroth_ifd, "Exif": exif_ifd, "GPS": gps_ifd}
    exif_bytes = piexif.dump(exif_dict)

    # insert exif bytecode into image
    piexif.insert(exif_bytes, args.input)


if __name__ == "__main__":
    from argparse import ArgumentParser

    parser = ArgumentParser()

    # Arguments
    parser.add_argument("-i",
                        "--input",
                        action="store",
                        dest="input",
                        required=True,
                        help="input image")
    parser.add_argument("-m",
                        "--metadata",
                        action="store",
                        dest="metadata",
                        required=True,
                        help="metadata to embed")
    parser.add_argument("-o",
                        "--output",
                        action="store",
                        dest="output",
                        help="output image")

    # Specify output of "--version"
    parser.add_argument(
        "--version",
        action="version",
        version="%(prog)s (version {version})".format(version=__version__))

    args = parser.parse_args()
    main(args)
