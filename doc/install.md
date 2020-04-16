>文档尚不完善，如有问题欢迎[提 issue](https://github.com/Benature/WordReview/issues) 或者 email(<wbenedict@163.com>) 或者私戳我 (●ﾟωﾟ●)
>不要不好意思，什么问题都可以问，大家都有刚开始的时候嘛

# 1. 当然是先克隆代码啦

```shell
git clone https://github.com/Benature/WordReview.git
```

<b><details><summary>🙋提问：这个 `git` 是什么东西？</summary></b>

如果你不知道 git 是什么，请到[此处](https://git-scm.com/downloads)下载安装。

关于安装的选项，可以自行搜索`win/mac 安装 git`等字样，找一篇点击量高的博客参考即可。

</details>
</br>

进入项目文件夹内，复制一份`./config_sample.py`文件，改名为`./config.py`。

# 2. Python 环境

<b><details><summary>选择一：开发者流程</summary></b>

1. Install `Miniconda` (recommanded) or `Anaconda` at first.
2. create a virtual environment  
  名字随便定，这里以`tgword`为例

```shell
conda create -n tgword python=3
```

>如果你没有其他 django 的项目，偷懒起见可以不创建虚拟环境，以及下面关于虚拟环境的步骤。

3. activate the environment

```shell
source activate tgword 
```

此时命令行左边应该有显示`(tgword)`

4. install requirements

```shell
pip install -r requirements.txt
```

</details>

<b><details open><summary>选择二：小白流程</summary></b>

你只要能运行 Python 就好了！

在命令行跑这个👇

```shell
pip install django pypugjs pymysql django-compressor django-sass-processor libsass mysqlclient -i http://mirrors.aliyun.com/pypi/simple/ 
```

</details>

<b><details open><summary>另：你可能会遇到的问题</summary></b>

- pip 命令不见了（像下面这种报错）

```shell
pip: command not found
```

那么请看[这里](https://benature.github.io/python-code/pip-cmd-not-found/)

<!-- - 其他你 handle 不了的报错
  那就退而求其次跑下面这个吧 -->

</details>


# 3. 数据库

二选一即可（小白推荐`sqlite`）

## 3.1. 选择一：sqlite3


`config.py`文件下，找到下面这个变量，定义为`sqlite`。（默认就是这个，一般不用动了）

```python
# 使用数据库类型：`mysql`、`sqlite`
database_type = 'sqlite'
```

>不过我是用 MySQL 的，如果想直接操作数据库的话，主要靠你自己百度的，你来问我我也是去百度的。  
>当然，只要你操作正常，一般没必要去直接操作数据库的。  
>再其实，就算要直接操作数据库，也可以借助 GUI 工具，工具有哪些可以[自己找找看](https://www.bing.com/search?q=sqlite+GUI)。

## 3.2. 选择二：MySQL

<b><details><summary>MySQL 操作这么繁琐一看就劝退喽</summary></b>

### 3.2.1. Install

<b><details><summary>MacOS</summary></b>
1. 下载  
download from <https://dev.mysql.com/downloads/mysql/>, select `macOS 10.14 (x86, 64-bit), DMG Archive`(.dmg file)

>顺路会看到一个叫 workbench 的，可视化工具，就像看 excel 看数据库，which is recommended.

2. 安装  
clike `next` all the way.

3. 设置环境变量

如果`mysql -Version`命令会报错，补一下环境变量

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

### 3.2.2. Mysql configuration

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

>如果你在这里自定义了数据库名和用户名的话，需要去`config.py`内修改对应的数据库配置

`config.py`文件下，找到下面这个变量，定义为`mysql`。（默认就是这个，一般不用动了）

```python
# 使用数据库类型：`mysql`、`sqlite`
database_type = 'mysql'
```

</details>


# 4. 前戏

在这个**仓库根目录**下

```shell
# 首先确保在虚拟环境下
conda activate tgword # 小白跳过
```

1. 数据库迁移
  
  ```shell
  python manage.py makemigrations
  python manage.py migrate
  ```

2. 运行 server
  
  ```shell
  python manage.py runserver
  ```

3. debug 🤦‍♂️  
  然后大概率会报错👇，因为有个包有问题（实名甩锅）
  
  ```error
  mysqlclient 1.3.13 or newer is required;
  ```
  
  根据自己情况修改`/path/to/xxxconda`部分，修改文件
  
  ```shell
  vim /path/to/xxxconda/lib/python3.7/site-packages/django/db/backends/mysql/  base.py
  ```
  
  >这里用的是`vim`编辑器（mac 自带但 windows 不自带的），选择你顺手的编辑器就可以了，不一  定要在命令行操作。
  
  找到下面两行，注释之
  
  ```python
  #if version < (1, 3, 13):
  #    raise ImproperlyConfigured('mysqlclient 1.3.13 or newer is required;   you have %s.' % Database.__version__)
  ```

4. 开始背单词！

  ```shell
  conda activate <venvName> # 小白流程不用这条命令
  python manage.py runserver
  ```

  打开[localhost:8000](localhost:8000/)，开始背单词之旅吧 🤓

当然在此之前你大概需要导入单词数据，那么请看[这里](./database_init.md)

---

当你想要更新代码的时候，请

```shell
git pull
python manage.py makemigrations
python manage.py migrate
```

更多说明请回到[这里](https://github.com/Benature/WordReview#%E4%BD%BF%E7%94%A8)查看