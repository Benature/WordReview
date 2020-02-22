# 1. Python 环境

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


# 2. MySQL

## 2.1. Install

<b><details><summary>MacOS</summary></b>
1. 下载  
download from <https://dev.mysql.com/downloads/mysql/>, select `macOS 10.14 (x86, 64-bit), DMG Archive`(.dmg file)

>顺路会看到一个叫 workbench 的，可视化工具，就像看 excel 看数据库，which is recommended.

2. 安装  
clike `next` all the way.

set the PATH

```shell
vim ~/.bash_profile
# 增加以下这行
PATH=$PATH:/usr/local/mysql/bin
```

</details>

<b><details><summary>Windows</summary></b>
同样在<https://dev.mysql.com/downloads/mysql/>下载，略。
</details>

<b><details><summary>Ubuntu</summary></b>

```shell
# download the configuration
wget https://dev.mysql.com/get/mysql-apt-config_0.8.14-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.14-1_all.deb
# default is fine, select OK and return

sudo apt update
sudo apt-get install mysql-server
# set password(spa2020)
# use strong password encryption

sudo mysql_secure_installation
# enter password
# n (不换root密码)
# Remove anonymous users? : y（删除匿名用户）
# Disallow root login remotely?: n（是否禁止 root 远程登录）
# Remove test database and access to it? : y（删除测试数据库）
# Reload privilege tables now? : y（立即重新加载特权表）

mysql -V # check version
# mysql  Ver 8.0.19 for Linux on x86_64 (MySQL Community Server - GPL)
```

</details>

<b><details><summary>WSL</summary></b>
参见[此文](https://benature.github.io/linux/wsl-install-mysql8/)
</details>


>macOS 和 Windows 下可以装个数据库 GUI app  
>  - MySQL Workbench (free & recommend)  
>  ~~如同处理 excel，不用学 mysql 命令也能操作数据库啦~~

## 2.2. Mysql configuration

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

# 3. 前戏

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
