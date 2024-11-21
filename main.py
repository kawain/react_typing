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


def task1():
    """ひらがなにする"""

    with open("origin.txt", "r", encoding="utf-8") as f:
        lines = f.readlines()

    new_lst = []

    for line in lines:
        eng, jpn = line.strip().split("★")
        result = convert_hiragana(jpn)
        new_lst.append([eng, jpn, result])

    with open("./public/questions.txt", "w", encoding="utf-8") as f:
        for v in new_lst:
            data = f"{v[0]}★{v[1]}★{v[2]}\n"
            f.write(data)


def read_csv_and_write():
    new_lins = []
    lines = []
    with open("origin.txt", "r", encoding="utf-8") as f:
        lines = f.readlines()

    for line in lines:
        eng, jpn = line.strip().split("★")
        tmp = jpn.strip().split(" ")
        if len(tmp) == 2:
            if tmp[0] == tmp[1]:
                jpn = tmp[0]

        data = f"{eng}★{jpn}"
        new_lins.append(data)

    with open("origin.txt", "w", encoding="utf-8") as f:
        for v in new_lins:
            f.write(f"{v}\n")


task1()
# read_csv_and_write()
