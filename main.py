import random
import csv
import pykakasi
import unicodedata

kakasi = pykakasi.kakasi()


def convert_hiragana(text):
    # 事前の置換
    text = text.replace("入って", "はいって")
    text = text.replace("入る", "はいる")

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
    for v in data:
        result = convert_hiragana(v[0])
        new_lst.append([v[0], result])

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
    with open("origin2.csv", "w", encoding="utf-8") as f:
        f.writelines(lines)


def test_hiragan():
    text = "何も入る"
    result = convert_hiragana(text)
    print(result)


def test_hepburn():
    text = "じかん"
    result = convert_hepburn(text)
    print(result)


task1()
# task2()
# random_data()
# test_hiragan()
# test_hepburn()