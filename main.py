import random
import csv
import pykakasi
import unicodedata

kakasi = pykakasi.kakasi()


def convert_hiragana(text):
    text = unicodedata.normalize("NFKC", text)

    hiragana_txt = ""
    result = kakasi.convert(text)
    for item in result:
        hiragana_txt += item["hira"]

    # 追加の置換
    hiragana_txt = hiragana_txt.replace("おきん", "おかね")

    return hiragana_txt


def convert_hepburn(text):
    hepburn_txt = ""
    result = kakasi.convert(text)
    for item in result:
        hepburn_txt += item["hepburn"]

    return hepburn_txt


def task1():
    """ひらがなにする"""

    with open("origin.csv", encoding="utf-8") as f:
        reader = csv.reader(f)
        data = [row for row in reader]

    new_lst = []
    for eng, jpn in data:
        result = convert_hiragana(jpn)
        new_lst.append([eng, jpn, result])

    # UTF-8でCSVファイルに書き込み
    with open("./public/questions.csv", "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(new_lst)


def task2():
    """ヘボン式する"""

    with open("output.csv", encoding="utf-8") as f:
        reader = csv.reader(f)
        data = [row for row in reader]

    new_lst = []
    for a, b, c in data:
        result = convert_hepburn(c)
        new_lst.append([a, b, c, f"{a} {result}"])

    # UTF-8でCSVファイルに書き込み
    with open("questions.csv", "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(new_lst)


def random_data():
    # テキストファイルを読み込んで配列に格納
    with open("origin.csv", "r", encoding="utf-8") as f:
        lines = f.readlines()

    # 配列をランダムに並び替え
    random.shuffle(lines)

    # 並び替えた内容を新しいファイルに書き込み
    with open("output.csv", "w", encoding="utf-8") as f:
        f.writelines(lines)


def test_hiragan():
    text = "何も入る"
    result = convert_hiragana(text)
    print(result)


def test_hepburn():
    text = "じかん"
    result = convert_hepburn(text)
    print(result)


def test1():
    """2列か確認"""

    with open("origin.csv", "r", encoding="utf-8") as f:
        lines = f.readlines()

    for v in lines:
        tmp = v.split(",")
        if len(tmp) != 2:
            print(v)


def test2():
    with open("origin.csv", "r", encoding="utf-8") as f:
        lines = f.readlines()

    d = {}
    for v in lines:
        tmp = v.split(",")
        if tmp[0] in d:
            d[tmp[0]] += 1
        else:
            d[tmp[0]] = 1

    for k in d:
        if d[k] > 1:
            print(k)


def test3():
    """重複は説明が長い方を採用"""

    # データを格納する辞書
    word_dict = {}

    # ファイルを読み込む
    with open("origin.csv", "r", encoding="utf-8") as f:
        lines = f.readlines()

    # 各行を処理
    for line in lines:
        # 改行文字を削除してカンマで分割
        tmp = line.strip().split(",")
        if len(tmp) >= 2:
            eng = tmp[0]
            jpn = tmp[1]

            # 既存のエントリと比較して、より長い説明文があれば更新
            if eng not in word_dict or len(jpn) > len(word_dict[eng]):
                word_dict[eng] = jpn

    # 結果を新しいファイルに書き込む
    with open("output.csv", "w", encoding="utf-8") as f:
        for eng, jpn in word_dict.items():
            f.write(f"{eng},{jpn}\n")


task1()
# task2()
# random_data()
# test_hiragan()
# test_hepburn()
# test1()
# test2()
# test3()
