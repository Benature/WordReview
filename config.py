__all__ = ['config']

import configparser

default_dict = {
    'db_type': 'sqlite',
    'auto_open_browser': 'yes',
}

config = configparser.ConfigParser(default_dict)
config.read('config.conf')
