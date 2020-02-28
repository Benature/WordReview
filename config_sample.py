import os

# ======================================================
#                    用户自定义配置区
# ======================================================

# 使用数据库类型：`mysql`、`sqlite`
database_type = 'sqlite'


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
