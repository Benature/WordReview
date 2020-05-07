__all__ = ['config']

import configparser
import os

default_dict = {
    'db_type': 'sqlite',
    'auto_open_browser': 'yes',
}

config = configparser.ConfigParser(default_dict)
# print(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.conf'))
config.read(os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    'config.conf'), encoding='utf-8')
