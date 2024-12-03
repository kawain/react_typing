import sys
from kanjiconv import KanjiConv

kanji_conv = KanjiConv(separator="")


def convert_hiragana(text):
    return kanji_conv.to_hiragana(text)


def make_questions_text():
    """ひらがなにしながらquestions.txt作成"""

    pairs = []
    with open("origin.txt", "r", encoding="utf-8") as file:
        current_pair = []
        for line in file:
            line = line.strip()
            if line and line != "----------":
                current_pair.append(line)
                if len(current_pair) == 2:
                    pairs.append(tuple(current_pair))
                    current_pair = []

    new_lst = []
    for eng, jpn in pairs:
        result = convert_hiragana(jpn)
        new_lst.append([eng, jpn, result])

    with open("./public/questions.txt", "w", encoding="utf-8") as f:
        for v in new_lst:
            data = f"{v[0]}★{v[1]}★{v[2]}\n"
            f.write(data)


def check_origin_fomat():
    """origin.txtの形式は正しいかチェック"""

    with open("origin.txt", "r", encoding="utf-8") as f:
        total = 1
        i = 1
        for line in f:
            line = line.strip()
            if i % 3 == 0:
                if line != "----------":
                    print(total, line)
                    sys.exit()
                i = 1
            else:
                i += 1

            total += 1

    print("終了")


make_questions_text()

# check_origin_fomat()
