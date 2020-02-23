# 用户自定义配置区

# ======================================================
#                    新增数据库信息配置
# ======================================================

BOOK = 'CET6_green'  # 单词本的名字（请用英文，不带空格）
BOOK_zh = '新东方六级绿皮书'  # 单词本的中文名
BOOK_abbr = 'G'  # 单词本的缩写（用于日历显示，建议一个英文大写字符）
begin_index = 0  # 单词本 list、unit、index 的序号从 0 开始还是从 1 开始

excel_path = '/file/path/to/excel.xlsx'


# ======================================================
#                数据库使用配置（若需自定义）
# ======================================================

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
