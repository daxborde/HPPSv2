from os.path import normpath
from sqlite3 import connect
from argparse import ArgumentParser
from pandas import DataFrame, read_csv, read_sql_query
# fuzz is used to compare TWO strings
from fuzzywuzzy import fuzz
from string import ascii_letters, digits
from numpy import nan

# process is used to compare a string to MULTIPLE other strings
from fuzzywuzzy import process

__author__ = "dax"
__version__ = "0.1.0"
__license__ = "MIT"

# def read_csv(csv_path, database_path, table_name="CSVData"):
#     """ Read CSV file into SQLite database """
#     # print(args)

#     df = read_csv(normpath(csv_path))
#     conn = connect(normpath(database_path))
#     df.to_sql(table_name, conn, if_exists='replace')


def fuzzy_search(csv_df, query):
    """ Fuzzy search for entry in CSV """
    # print(f"q={query}")

    whitelist = ascii_letters + ' ' # digits
    trimmed_query = ''.join(c for c in query if c in whitelist)
    
    # remove and use different table
    df = csv_df
    # db = connect(normpath(args.database_path))
    # df.to_sql(args.table_name, db, if_exists='replace')

    # print(df.columns)
    # choices = df['Surname'].unique()
    # print(choices)
    possible = process.extract(trimmed_query, df['combined'], scorer=fuzz.token_sort_ratio, limit=1)
    # print(f"p={possible}")
    return possible[0][2]

def database_entry(csv_path, database_path, pipeline_results, entry_table):
    db = connect(normpath(database_path))
    pipeline_df = read_sql_query(f"SELECT * FROM {pipeline_results}", db)
    csv_df = read_csv(normpath(csv_path))

    csv_df['combined'] = csv_df[csv_df.columns[0:6]].apply(
        lambda x: ' '.join(x.dropna().astype(str)),
        axis=1
    )

    eachResult = lambda p: fuzzy_search(csv_df, p[0])
    pipeline_df['foundidx'] = pipeline_df[['ocr_results']].apply(eachResult, axis=1)

    # new_df = pipeline_df[['crop_path', 'foundidx']]
    # m
    def eachIdx(i):
        res = pipeline_df.loc[pipeline_df['foundidx'] == i]['crop_path']
        if not res.empty:
            return res.iloc[0]
        return nan
    csv_df['filepath'] = csv_df.index.map(eachIdx)
    csv_df.to_sql(entry_table, db, if_exists='replace')


if __name__ == "__main__":
    """ This is executed when run from the command line """

    parser = ArgumentParser(
        description="Search a SQLite table for full text with spellcheck.")

    # Required positional arguments
    # parser.add_argument(
    #     # TODO REMOVE OPTIONALITY
    #     "query",
    #     help="Query to fuzzy search the CSV for."
    # )

    parser.add_argument(
        "csv_path", 
        # REMOVE DEFAULT VALUE
        # default="C:\\Users\\Dax\\AlexandriaNCData.csv",
        help="Path to a CSV file."
    )

    parser.add_argument(
        "database_path",
        # REMOVE DEFAULT VALUE
        # default="C:\\Users\\Dax\\tryme.db",
        help="Path to an existing or new SQLite database file."
    )


    # parser.add_argument(
    #     "-s",
    #     "--spellfix_path",
    #     default="D:\\source\\python-components\\spellfix",
    #     help="Path to spellfix extension."
    # )

    parser.add_argument(
        "-p",
        "--pipeline-results",
        default="PipelineResults",
        help="Name of the table in the database where the data will be inserted.")

    parser.add_argument(
        "-e",
        "--entry-table",
        default="MatchedResults",
        help="Name of the table in the database where the data will be inserted.")

    # # Specify output of "--version"
    # parser.add_argument(
    #     "--version",
    #     action="version",
    #     version="%(prog)s (version {version})".format(version=__version__))


    # fuzzy_search(csv_path, search_query, database_path, table_name):
    args = parser.parse_args()
    # args.database_path, args.table_name
    # match_idx = fuzzy_search(args.csv_path, args.query)
    database_entry(args.csv_path, args.database_path, args.pipeline_results, args.entry_table)

