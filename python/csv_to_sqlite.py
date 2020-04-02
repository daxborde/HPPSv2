#!/usr/bin/env python3
"""
Import a CSV file to a table in a SQLite database.
"""

__author__ = "alex"
__version__ = "0.1.0"
__license__ = "MIT"

from argparse import ArgumentParser
from os.path import normpath
from sqlite3 import connect
from pandas import read_csv
from pandas import DataFrame

def main(args):
    """ Main entry point of the app """
    # print(args)

    df = read_csv(normpath(args.csv_path))
    conn = connect(normpath(args.database_path))
    df.to_sql(args.table_name, conn, if_exists='replace')

if __name__ == "__main__":
    """ This is executed when run from the command line """

    parser = ArgumentParser(
        description="Import a CSV file to a table in a SQLite database.")

    # Required positional arguments
    parser.add_argument("csv_path", help="Path to a CSV file.")

    parser.add_argument("database_path",
                        help="Path to an existing or new SQLite database file.")

    parser.add_argument(
        "-t",
        "--table-name",
        action="store_true",
        default="CSVData",
        help="Name of the table in the database where the data will be inserted.")

    # Specify output of "--version"
    parser.add_argument(
        "--version",
        action="version",
        version="%(prog)s (version {version})".format(version=__version__))

    args = parser.parse_args()
    main(args)
