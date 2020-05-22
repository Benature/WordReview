import requests
from bs4 import BeautifulSoup as bs
import re


def crawl_other_dict(word, url):
    '''crawl data from other dictionary sites'''
    if url == "http://dict.cn/mini.php":
        try:
            soup = bs(requests.get(
                f"http://dict.cn/mini.php?q={word}").text, 'lxml')
            out = re.sub(r'<body.*?>|</body>', '',
                         str(soup.select('body')[0])).strip('\n ')
            out = '<div style= "font-size:12px;">' + out + '</div>'
            return 200, str(out)
        except Exception as e:
            return 505, e
    elif url == 'http://www.wordsand.cn/lookup.asp':
        try:
            soup = bs(requests.get(
                f'http://www.wordsand.cn/lookup.asp?word={word}').text, 'lxml')
            out = re.findall(r'<td.*valign.*width.*bgcolor.*>([\s\S]*?)<\/td>')
            print(out)
            return 200, out
        except Exception as e:
            return 505, e
    elif url == 'https://mnemonicdictionary.com/':
        try:
            soup = bs(requests.get(
                f'https://mnemonicdictionary.com/?word={word}').text, 'lxml')
            data = []
            for card in soup.select('.card.mnemonic-card'):
                footers = re.findall(r'(\d+)[^\d]+?(\d+)',
                                     card.select('.card-footer')[0].text.strip())[0]
                data.append({
                    'text': card.select('.card-text')[0].text.strip(),
                    'up': int(footers[0]),
                    'down': int(footers[1]),
                })
            return 200, data
        except Exception as e:
            return 505, e
