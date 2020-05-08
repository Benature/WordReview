import pandas as pd
from pandas import read_excel
# import pandas as pd
import config

# read_excel = pd.read_excel
# bookName = config.BOOK  # 请用英文
# List_begin_num = config.begin_index  # 或 1，看你的 List 是从 0 开始还是 1 开始

'''
如果是 excel/csv，你应该有以下列
word 单词
mean 中文
List
Unit
Index
'''

# path = config.excel_path
# df = read_excel(path)


def import_word(Review, df, bookName):
    print('begin import db Review')
    optional_keys = ['Unit']
    for key in optional_keys:
        if key not in df.columns:
            optional_keys.remove(key)
    print('optional keys', optional_keys)

    for i in range(0, (len(df))):
        dr = df.iloc[i]
        review_db = {
            'word': dr['word'],
            'LIST': dr['List'],
            # 'UNIT': dr['Unit'],
            'INDEX': dr['Index'],
            'BOOK': bookName,
        }
        for key in optional_keys:
            review_db[key.upper()] = dr[key]
        print(i, dr['word'])

        new_word = Review.objects.create(**review_db)
        new_word.save()

    print('finish import db Review')


def init_db_booklist(BookList, Review, bookName, List_begin_num):
    print('begin import db BookList')
    for l in range(List_begin_num, List_begin_num + len(set(Review.objects.filter(BOOK=bookName).values_list('LIST')))):
        ld = Review.objects.filter(BOOK=bookName, LIST=l)  # list data
        if len(ld) == 0:
            print(f"List{l} has no content")
            continue
        print(l)
        # rate = sum([r[0] if r[0] is not None else 1 for r in ld.values_list('rate')
        #             ]) / len(ld) * 1
        # rate = 1 - rate if rate != 0.0 else 0
        data = {
            'LIST': l,
            'BOOK': bookName,
            # 'list_rate': rate,
            'word_num': len(ld),
            # 'review_word_counts': ';'.join(
            #     set([str(t[0]) for t in ld.values_list('total_num')])),
        }
        BookList.objects.create(**data)
    print('finish import db BookList')


def init_db_words(Review, Words, df):
    print('begin import db Words')
    # path = config.excel_path
    # df = read_excel(path)
    optional_keys = ['sentence', 'mnemonic',
                     'phonetic', 'antonym', 'synonym', 'derivative']
    for key in optional_keys:
        if key not in df.columns:
            optional_keys.remove(key)
    print('optional keys', optional_keys)

    for i in range(0, (len(df))):
        dr = df.iloc[i]
        try:
            word = Words.objects.get(word=dr['word'])
            print('skip because word already exists', dr['word'])
            continue
        except:
            print(word.word)
            data = {
                'word': dr['word'],
                'mean': dr['mean'],
            }
            for key in optional_keys:
                data[key] = dr[key]
            word = Words.objects.create(**data)
            word.save()
    print('finish import db Words')


def init_db_books(Books, BOOK, BOOK_zh, BOOK_abbr, begin_index):
    print('begin import db Books')
    data = {
        'BOOK': BOOK,
        'BOOK_zh': BOOK_zh,
        'BOOK_abbr': BOOK_abbr,
        'begin_index': begin_index,
    }
    Books.objects.create(**data).save()
    print('finish import db Books')


def init_db(BOOK, BOOK_zh, BOOK_abbr, begin_index, excel_path, Books, Review, BookList, Words):
    df = read_excel(excel_path)
    init_db_words(Review, Words, df)
    import_word(Review, df, BOOK)
    init_db_booklist(BookList, Review, BOOK, begin_index)
    init_db_books(Books, BOOK, BOOK_zh, BOOK_abbr, begin_index)


def update_db(Words):
    fail = []
    df = pd.read_csv('data/xxxx.csv')
    df = df.fillna('')
    for i, data in enumerate(df.iloc):
        # if i < 2500:
        #     continue
        print(i, data['word'], end='|')
        # break
        try:
            word = Words.objects.get(word=data['word'])
        except:
            print(data['word'])
            print('\nunfound word', data['word'])
            fail.append(data['word'])
            # break
            continue
        word.antonym = data['antonym']
        word.synonym = data['synonyms']
        word.derivative = data['derivative']
        word.save()
        print(word.word)
        # break
    print('fail counts', len(fail), '/', len(df))
    print(set(fail))
