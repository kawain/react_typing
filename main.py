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
    hiragana_txt = hiragana_txt.replace("・", "、")
    hiragana_txt = hiragana_txt.replace("おきん", "おかね")

    return hiragana_txt


def convert_hepburn(text):
    # 事前の置換
    text = text.replace("ー", "-")

    hepburn_txt = ""
    result = kakasi.convert(text)
    for item in result:
        hepburn_txt += item["hepburn"]

    # 追加の置換
    hepburn_txt = hepburn_txt.replace("shi", "si")
    hepburn_txt = hepburn_txt.replace("chi", "ti")
    hepburn_txt = hepburn_txt.replace("tsu", "tu")
    hepburn_txt = hepburn_txt.replace("cha", "tya")
    hepburn_txt = hepburn_txt.replace("chu", "tyu")
    hepburn_txt = hepburn_txt.replace("cho", "tyo")
    hepburn_txt = hepburn_txt.replace("sha", "sya")
    hepburn_txt = hepburn_txt.replace("shu", "syu")
    hepburn_txt = hepburn_txt.replace("sho", "syo")

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


def task_test():
    text = "ナイフ・フォーク類"
    result = convert_hiragana(text)
    print(result)


task1()
# task2()
# random_data()
# task_test()
