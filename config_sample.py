import os

# ======================================================
#                    用户自定义配置区
# ======================================================

# 使用数据库类型：`mysql`、`sqlite`
database_type = 'mysql'


# ======================================================
#                    新增数据库信息配置
# ======================================================

# 初始化数据库时请使用 True，初始化后一定要改回 False！！！
# 初始化数据库时请使用 True，初始化后一定要改回 False！！！
# 初始化数据库时请使用 True，初始化后一定要改回 False！！！
init_db_mode = True  # 初始化数据库时请使用 True，初始化后一定要改回 False！！！

BOOK = 'CET6_green'  # 单词本的名字（请用英文，不带空格）
BOOK_zh = '新东方六级绿皮书'  # 单词本的中文名
BOOK_abbr = 'G'  # 单词本的缩写（用于日历显示，建议一个英文大写字符）
begin_index = 0  # 单词本 list、unit、index 的序号从 0 开始还是从 1 开始

# 单词数据的文件路径（建议使用绝对路径，若用相对路径请修改
excel_path = '/file/path/to/excel.xlsx'


# ======================================================
#                      数据库使用配置
#          （除非你知道你在干嘛，否则请勿修改下面代码）
# ======================================================

if database_type == 'mysql':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'tg_word_db',
            'USER': 'tg_word_user',
            'PASSWORD': 'tg_word2020',
            'HOST':  'localhost',
            'PORT': '',
        }
    }
elif database_type == 'sqlite':
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
else:
    raise ValueError(f'请选择正确的数据库：`mysql`、`sqlite`，而非{database_type}')
