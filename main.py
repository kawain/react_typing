import sys
import re
from kanjiconv import KanjiConv
import jaconv

kanji_conv = KanjiConv(separator="")


def split_text_by_pattern(text):
    # pattern = re.compile(r"[a-zA-Z0-9]+")
    pattern = re.compile(r"[a-zA-Z0-9;；「」:　 ]+")
    results = []
    last_end = 0

    for match in pattern.finditer(text):
        start, end = match.span()

        # 英数字以外の部分（マッチの前）を追加
        if start > last_end:
            non_alpha = text[last_end:start]
            results.append(("non_alphanumeric", non_alpha))

        # 英数字部分を追加
        results.append(("alphanumeric", match.group()))
        last_end = end

    # 最後の英数字以外の部分を追加
    if last_end < len(text):
        results.append(("non_alphanumeric", text[last_end:]))

    return results


def convert_time_format(text):
    # 半角数字+「とき」のパターンを「じ」に置換
    pattern = r"(\d+)とき"
    result = re.sub(pattern, r"\1じ", text)
    return result


def convert_hiragana(text):
    text = text.replace("私は", "わたしは")
    text = jaconv.z2h(text, kana=False, digit=True, ascii=True)
    results = split_text_by_pattern(text)
    result = ""
    for v in results:
        if v[0] == "non_alphanumeric":
            result += kanji_conv.to_hiragana(v[1])
        else:
            result += v[1]

    return result


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
        result = convert_time_format(result)
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
