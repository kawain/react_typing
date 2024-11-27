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


def check1():
    lst = []
    # ファイルの内容を読み込む
    with open("origin.txt", "r", encoding="utf-8") as f:
        for v in f:
            lst.append(v.strip())

    # 英単語をキーとした辞書を作成
    word_dict = {}
    for line in lst:
        en, jp = line.split("★")
        if en in word_dict:
            # 既存の日本語説明と新しい日本語説明を比較
            existing_jp = word_dict[en]
            if len(jp) < len(existing_jp):
                # 新しい説明の方が短い場合は更新しない
                continue
            word_dict[en] = jp
        else:
            word_dict[en] = jp

    # 重複のない結果を新しいファイルに書き出す
    with open("result.txt", "w", encoding="utf-8") as f:
        for en, jp in word_dict.items():
            f.write(f"{en}★{jp}\n")


def check2():
    lst = []
    # ファイルの内容を読み込む
    with open("origin.txt", "r", encoding="utf-8") as f:
        for v in f:
            lst.append(v.strip())

    for v in lst:
        tmp = v.split("★")
        if len(tmp) != 2:
            print(v)


task1()
# check1()
# check2()
