from config import config
if config.get('custom', 'db_type') == 'mysql':
    import pymysql
    pymysql.install_as_MySQLdb()
# import pymysql
# pymysql.install_as_MySQLdb()
