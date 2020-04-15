import requests
from bs4 import BeautifulSoup as bs
import re


def crawl_dict_mini(word):
    try:
        soup = bs(requests.get(
            f"http://dict.cn/mini.php?q={word}").text, 'lxml')
        out = re.sub(r'<body.*?>|</body>', '',
                     str(soup.select('body')[0])).strip('\n ')
        out = '<div style= "font-size:12px;">' + out + '</div>'
        return 200, out
    except Exception as e:
        return 505, e
