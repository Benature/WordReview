# Python 环境

1. Install `Miniconda` (recommanded) or `Anaconda` at first.
2. create a virtual environment

>名字随便定，这里以`tgword`为例

```shell
conda create -n tgword
```

1. activate the environment

```shell
source activate tgword 
```

此时命令行左边应该有显示`(tgword)`

4. install requirements

```shell
pip install -r requirements.txt
```


# 1. MySQL

## 1.1. Install

### 1.1.1. MacOS

1. 下载
download from <https://dev.mysql.com/downloads/mysql/>, select `macOS 10.14 (x86, 64-bit), DMG Archive`(.dmg file)

>顺路会看到一个叫 workbench 的，可视化工具，就像看 excel 看数据库，which is recommended.

1. 安装
clike `next` all the way.

set the PATH

```shell
vim ~/.bash_profile
PATH=$PATH:/usr/local/mysql/bin
```

### Windows

同样在<https://dev.mysql.com/downloads/mysql/>下载，略。

### 1.1.2. GUI app 数据库可视化工具（荐）

- MySQL Workbench (free & recommend)
  ~~如同处理 excel，不用学 mysql 命令也能操作数据库啦~~

## 1.2. Mysql configuration

登录进入 mysql 命令行，密码是安装时候设置的那个。

```shell
mysql -uroot -p
```

```sql
show databases;
use mysql;
create database tg_word_db character set utf8;
create user 'tg_word_user'@'localhost' identified by 'tg_word2020'; -- 新建用户
grant all privileges ON tg_word_db.* TO 'tg_word_user'@'localhost'; -- 授权
flush privileges; -- 刷新系统权限表
```

# 前戏

1. 数据库迁移

```shell
python manage.py makemigrations
python manage.py migrate
```

2. 运行 server

```shell
python manage.py runserver
```

3. debug🤦‍♂️
然后大概率会报错，因为有个包有问题（实名甩锅），从报错也能看出来

```shell
vim /opt/miniconda3/lib/python3.7/site-packages/django/db/backends/mysql/base.py
```

找到下面两行，注释之

```python
#if version < (1, 3, 13):
#    raise ImproperlyConfigured('mysqlclient 1.3.13 or newer is required; you have %s.' % Database.__version__)
```
