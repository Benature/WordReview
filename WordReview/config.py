__all__ = ['config']

import configparser
from pathlib import Path
import os

default_dict = {
    'db_type': 'sqlite',
    'auto_open_browser': 'yes',
}

_project_dir = Path(__file__).parent
_config_file_path = _project_dir / 'config.conf'


def check_config_file_exists():
    if not os.path.exists(_config_file_path):
        from shutil import copyfile
        print("【步骤遗漏！】还没有复制配置文件哦...")
        copyfile(_project_dir / "config_sample.conf", _config_file_path)
        print(
            f'但我已经帮你复制好了：\n{_project_dir / "config_sample.conf"} -> {_config_file_path}'
        )
        print("继续往下走吧～")


check_config_file_exists()

config = configparser.ConfigParser(default_dict)
# print(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.conf'))
config.read(_config_file_path, encoding='utf-8')
