import config
if config.database_type == 'mysql':
    import pymysql
    pymysql.install_as_MySQLdb()
# import pymysql
# pymysql.install_as_MySQLdb()
