import pandas as pd


def import_gre(model):
    path = '/Users/benature/OneDrive - LOSA/0_Project_A/托福练习/再要你命3000/3000(注释版).xlsx'
    path_mean = '/Users/benature/OneDrive - LOSA/0_Project_A/托福练习/再要你命3000/再要你命3000.xlsx'
    df = pd.read_excel(path)
    df2 = pd.read_excel(path_mean)
    df.sort_values(["List", "Unit", "Index"], inplace=True)
    df.fillna(0, inplace=True)
    df2.sort_values(["List", "Unit", "Index"], inplace=True)
    df2.fillna(0, inplace=True)

    for i in range(len(df)):
        dr = df.iloc[i]
        # if dr['学习次数'] == 0:
        #     break
        forget_num = dr['陌生计次']
        total_num = dr['学习次数']
        if total_num == 0:
            rate = None
        else:
            rate = forget_num / total_num
        history = '0'*int(forget_num) + '1'*int(total_num-forget_num)
        db = {
            'word': dr['Word'],
            'mean': df2.iloc[i]['释义'],
            'total_num': total_num,
            'forget_num': forget_num,
            'rate': rate,
            'LIST': dr['List'],
            'UNIT': dr['Unit'],
            'INDEX': dr['Index'],
            'BOOK': 'GRE3000',
            'history': history,
        }
        try:
            print(i, dr['Word'], df2.iloc[i]['释义'])
            new_word = model.objects.create(**db)
            new_word.save()
        except Exception as e:
            print(e)
        # break


def import_qugen(model):
    path = 'data/qugen10000.xlsx'
    df = pd.read_excel(path)
    for i in range(0, (len(df))):
        dr = df.iloc[i]
        db = {
            'word': dr['word'],
            'mean': dr['meaning'],
            'total_num': 0,
            'forget_num': 0,
            'rate': None,
            'LIST': dr['List'],
            'UNIT': dr['Unit'],
            'INDEX': dr['Index'],
            'BOOK': 'qugen10000',
            'history': '',
        }
        print(i, dr['word'], dr['meaning'])
        new_word = model.objects.create(**db)
        new_word.save()
        print(new_word)
