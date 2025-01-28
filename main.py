eng_arr = []
jpn_arr = []
furigana_arr = []

with open("origin.txt", "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        num, eng, jpn = line.split("★")
        eng_arr.append(eng)
        jpn_arr.append(jpn)


with open("furigana.txt", "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        num, furigana = line.split(". ")
        furigana_arr.append(furigana)


with open("./public/questions.txt", "w", encoding="utf-8") as f:
    for a,b,c in zip(eng_arr,jpn_arr,furigana_arr):
        data = f"{a}★{b}★{c}\n"
        f.write(data)

