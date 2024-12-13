import sys
import re
from kanjiconv import KanjiConv
import jaconv

kanji_conv = KanjiConv(separator="")


def split_text_by_pattern(text):
    # pattern = re.compile(r"[a-zA-Z0-9]+")
    pattern = re.compile(r"[a-zA-Z0-9;；「」: ]+")
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


def convert_format(text):
    pattern = r"(\d+)時"
    result = re.sub(pattern, r"\1じ", text)

    pattern = r"(\d+)日"
    result = re.sub(pattern, r"\1にち", result)

    pattern = r"(\d+)歳"
    result = re.sub(pattern, r"\1さい", result)

    pattern = r"(\d+)人"
    result = re.sub(pattern, r"\1にん", result)

    pattern = r"(\d+)年"
    result = re.sub(pattern, r"\1ねん", result)

    return result


def convert_hiragana(text):
    text = text.replace("私は", "わたしは")
    text = text.replace("私の", "わたしの")
    text = text.replace("私に", "わたしに")
    text = text.replace("私を", "わたしを")
    text = text.replace("何か", "なにか")
    text = text.replace("辛い", "からい")
    text = text.replace("分後", "ふんご")
    text = text.replace("一日", "いちにち")
    text = text.replace("1枚", "いちまい")
    text = text.replace("の国は", "のくには")
    text = text.replace("つ星", "つぼし")
    text = convert_format(text)

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

    new_lst = []

    with open("origin.txt", "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            eng, jpn = line.split("★")
            result = convert_hiragana(jpn)
            new_lst.append([eng, jpn, result])

    with open("./public/questions.txt", "w", encoding="utf-8") as f:
        for v in new_lst:
            data = f"{v[0]}★{v[1]}★{v[2]}\n"
            f.write(data)


make_questions_text()
