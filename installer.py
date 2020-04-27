import subprocess
import platform
import os
from shutil import copyfile

pathex = os.path.dirname(os.path.abspath(__file__))
print(pathex)
spec = '''# -*- mode: python ; coding: utf-8 -*-

import os
block_cipher = None
BASE_DIR = \'''' + pathex + '''\'

a = Analysis(['manage.py'],
             pathex=[BASE_DIR],
             binaries=[],
             datas=[
                (os.path.join(BASE_DIR, 'static'),'staticsfile'), 
                (os.path.join(BASE_DIR, 'templates'), 'templates'),
                (os.path.join(BASE_DIR, 'apps'), 'apps'),
                #(os.path.join(BASE_DIR, 'config_sample.conf'), '.'),
                #(os.path.join(BASE_DIR, 'pypi/pypugjs'), 'pypugjs'),
             ],
             hiddenimports=[
                'pkg_resources.py2_warn',
                'django.contrib.admin',
                'django.contrib.auth',
                'django.contrib.contenttypes',
                'django.contrib.sessions',
                'django.contrib.messages',
                'django.contrib.staticfiles',
                'sass_processor',
                'sass_processor.apps',
                'sass_processor.finders',
                'pypugjs',
                'pypugjs.ext.django',
                'pypugjs.ext.django.templatetags',
                'pandas.read_excel',
                'dateutil',
                'six',
                'xlrd',
                'requests',
                'bs4',
             ],
             hookspath=[],
             runtime_hooks=[],
             excludes=[
                'pymysql',
                'mysqlclient',
             ],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)

def get_pandas_path():
    import pandas
    pandas_path = pandas.__path__[0]
    return pandas_path
dict_tree = Tree(get_pandas_path(), prefix='pandas', excludes=["*.pyc"])
a.datas += dict_tree
a.binaries = filter(lambda x: 'pandas' not in x[0], a.binaries)
'''
if True or platform.architecture()[1] == 'WindowsPE':
    spec += '''def get_numpy_path():
    import numpy
    return numpy.__path__[0]
dict_tree = Tree(get_numpy_path(), prefix='numpy', excludes=["*.pyc"])
a.datas += dict_tree
a.binaries = filter(lambda x: 'numpy' not in x[0], a.binaries) '''

spec += '''
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)

Key = ['mkl','libopenblas']
#Key = ['mkl', 'libopenblas', 'liblapack', 'libblas', 'libcblas']
def remove_from_list(input, keys):
    outlist = []
    for item in input:
        name, _, _ = item
        flag = 0
        for key_word in keys:
            if name.find(key_word) > -1:
                flag = 1
        if flag != 1:
            outlist.append(item)
    return outlist
a.binaries = remove_from_list(a.binaries, Key)

exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='WordReview_D',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               upx_exclude=[],
               name='WordReview_D')
'''

spec_name = 'WordReview_D'
with open(os.path.join(pathex, spec_name+'.spec'), 'w') as f:
    f.write(spec)

res = subprocess.call(
    "pyinstaller --clean --noconfirm WordReview_D.spec", shell=True)
if res == 1:
    os._exit(0)

dist_path = os.path.join(pathex, f'dist/{spec_name}')
copyfile(os.path.join(pathex, 'config_sample.conf'),
         os.path.join(dist_path, 'config.conf'))
print('copy file config.conf')
# with open(os.path.join(pathex, 'config_sample.conf'), 'r') as f:
#     conf = f.read()
# with open(os.path.join(dist_path, 'config.conf'), 'w') as f:
#     f.write(conf)

copyfile(os.path.join(pathex, 'staticsfile/scss/review.css'),
         os.path.join(dist_path, 'staticsfile/scss/review.css'))

pug_path = os.path.join(dist_path, 'apps/review/templates/review.pug')
with open(pug_path, 'r') as f:
    pug = f.read()
with open(pug_path, 'w') as f:
    f.write(pug.replace(
        '''link(href="{% sass_src 'scss/review.scss' %}" rel="stylesheet" type="text/css")''',
        '''link(href="/static/scss/review.css" rel="stylesheet" type="text/css")'''
    ).replace(
        "{% load sass_tags %}",
        "//- {% load sass_tags %}"))

# print("begin remove useless files, in order to reduce package size")

# for useless in ['libblas.3.dylib', 'libcblas.3.dylib', 'liblapack.3.dylib']:
#     subprocess.call(f"rm {os.path.join(dist_path, useless)}", shell=True)
