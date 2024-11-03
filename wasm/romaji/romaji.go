package romaji

import (
	"strings"
)

var RomajiMap = map[string][]string{
	"あ":  {"a"},
	"い":  {"i"},
	"う":  {"u", "wu", "whu"},
	"え":  {"e"},
	"お":  {"o"},
	"か":  {"ka", "ca"},
	"き":  {"ki"},
	"く":  {"ku", "cu"},
	"け":  {"ke"},
	"こ":  {"ko", "co"},
	"さ":  {"sa"},
	"し":  {"si", "shi", "ci"},
	"す":  {"su"},
	"せ":  {"se", "ce"},
	"そ":  {"so"},
	"た":  {"ta"},
	"ち":  {"ti", "chi"},
	"つ":  {"tu", "tsu"},
	"て":  {"te"},
	"と":  {"to"},
	"な":  {"na"},
	"に":  {"ni"},
	"ぬ":  {"nu"},
	"ね":  {"ne"},
	"の":  {"no"},
	"は":  {"ha"},
	"ひ":  {"hi"},
	"ふ":  {"hu", "fu"},
	"へ":  {"he"},
	"ほ":  {"ho"},
	"ま":  {"ma"},
	"み":  {"mi"},
	"む":  {"mu"},
	"め":  {"me"},
	"も":  {"mo"},
	"や":  {"ya"},
	"ゆ":  {"yu"},
	"よ":  {"yo"},
	"ら":  {"ra"},
	"り":  {"ri"},
	"る":  {"ru"},
	"れ":  {"re"},
	"ろ":  {"ro"},
	"わ":  {"wa"},
	"を":  {"wo"},
	"ん":  {"n", "nn"},
	"が":  {"ga"},
	"ぎ":  {"gi"},
	"ぐ":  {"gu"},
	"げ":  {"ge"},
	"ご":  {"go"},
	"ざ":  {"za"},
	"じ":  {"zi", "ji"},
	"ず":  {"zu"},
	"ぜ":  {"ze"},
	"ぞ":  {"zo"},
	"だ":  {"da"},
	"ぢ":  {"di"},
	"づ":  {"du"},
	"で":  {"de"},
	"ど":  {"do"},
	"ば":  {"ba"},
	"び":  {"bi"},
	"ぶ":  {"bu"},
	"べ":  {"be"},
	"ぼ":  {"bo"},
	"ぱ":  {"pa"},
	"ぴ":  {"pi"},
	"ぷ":  {"pu"},
	"ぺ":  {"pe"},
	"ぽ":  {"po"},
	"ゔ":  {"vu"},
	"うぁ": {"wha", "uxa", "ula"},
	"うぃ": {"whi", "wi", "uxi", "uli"},
	"うぇ": {"whe", "we", "uxe", "ule"},
	"うぉ": {"who", "uxo", "ulo"},
	"ゔぁ": {"va", "vuxa", "vula"},
	"ゔぃ": {"vi", "vuxi", "vuli"},
	"ゔぇ": {"ve", "vuxe", "vule"},
	"ゔぉ": {"vo", "vuxo", "vulo"},
	"いぇ": {"ye", "ixe", "ile"},
	"きゃ": {"kixya", "kilya", "kya"},
	"きぃ": {"kixi", "kili", "kyi"},
	"きゅ": {"kixyu", "kilyu", "kyu"},
	"きぇ": {"kixe", "kye", "kile"},
	"きょ": {"kyo", "kilyo", "kixyo"},
	"ぎゃ": {"gilya", "gya", "gixya"},
	"ぎぃ": {"gyi", "gixi", "gili"},
	"ぎゅ": {"gilyu", "gixyu", "gyu"},
	"ぎぇ": {"gile", "gye", "gixe"},
	"ぎょ": {"gixyo", "gilyo", "gyo"},
	"しゃ": {"shilya", "shixya", "cixya", "silya", "sixya", "sya", "cilya", "sha"},
	"しぃ": {"cixi", "sili", "syi", "shixi", "shili", "cili", "sixi"},
	"しゅ": {"sixyu", "syu", "shixyu", "shilyu", "cixyu", "shu", "silyu", "cilyu"},
	"しぇ": {"sixe", "shile", "cile", "sye", "she", "sile", "shixe", "cixe"},
	"しょ": {"shixyo", "cixyo", "cilyo", "sixyo", "silyo", "sho", "shilyo", "syo"},
	"じゃ": {"zilya", "jya", "zixya", "zya", "jixya", "ja", "jilya"},
	"じぃ": {"zili", "jixi", "zixi", "zyi", "jili", "jyi"},
	"じゅ": {"jilyu", "jixyu", "ju", "jyu", "zilyu", "zyu", "zixyu"},
	"じぇ": {"zile", "jixe", "zye", "je", "jile", "zixe", "jye"},
	"じょ": {"zyo", "jyo", "jilyo", "zixyo", "jixyo", "jo", "zilyo"},
	"ちゃ": {"cya", "tya", "tixya", "chilya", "chixya", "tilya"},
	"ちぃ": {"cyi", "tili", "tixi", "tyi", "chixi", "chili"},
	"ちゅ": {"cyu", "tyu", "tilyu", "tixyu", "chilyu", "chixyu"},
	"ちぇ": {"cye", "tixe", "tile", "chile", "chixe", "tye"},
	"ちょ": {"cyo", "chixyo", "chilyo", "tixyo", "tilyo", "tyo"},
	"ぢゃ": {"dilya", "dya", "dixya"},
	"ぢぃ": {"dyi", "dixi", "dili"},
	"ぢゅ": {"dyu", "dixyu", "dilyu"},
	"ぢぇ": {"dile", "dixe", "dye"},
	"ぢょ": {"dyo", "dixyo", "dilyo"},
	"てゃ": {"texya", "telya", "tha"},
	"てぃ": {"teli", "thi", "texi"},
	"てゅ": {"texyu", "telyu", "thu"},
	"てぇ": {"tele", "texe", "the"},
	"てょ": {"texyo", "telyo", "tho"},
	"でゃ": {"dha", "dexya", "delya"},
	"でぃ": {"dhi", "deli", "dexi"},
	"でゅ": {"dexyu", "delyu", "dhu"},
	"でぇ": {"dele", "dexe", "dhe"},
	"でょ": {"dho", "delyo", "dexyo"},
	"にゃ": {"nilya", "nya", "nixya"},
	"にぃ": {"nili", "nyi", "nixi"},
	"にゅ": {"nixyu", "nyu", "nilyu"},
	"にぇ": {"nye", "nixe", "nile"},
	"にょ": {"nilyo", "nixyo", "nyo"},
	"ひゃ": {"hilya", "hya", "hixya"},
	"ひぃ": {"hyi", "hili", "hixi"},
	"ひゅ": {"hixyu", "hilyu", "hyu"},
	"ひぇ": {"hye", "hile", "hixe"},
	"ひょ": {"hixyo", "hyo", "hilyo"},
	"びゃ": {"bya", "bixya", "bilya"},
	"びぃ": {"byi", "bili", "bixi"},
	"びゅ": {"bixyu", "bilyu", "byu"},
	"びぇ": {"bye", "bile", "bixe"},
	"びょ": {"byo", "bixyo", "bilyo"},
	"ぴゃ": {"pilya", "pixya", "pya"},
	"ぴぃ": {"pixi", "pili", "pyi"},
	"ぴゅ": {"pilyu", "pyu", "pixyu"},
	"ぴぇ": {"pye", "pixe", "pile"},
	"ぴょ": {"pyo", "pilyo", "pixyo"},
	"ふぁ": {"hula", "fula", "huxa", "fuxa", "fa"},
	"ふぃ": {"fuxi", "huxi", "fuli", "huli", "fi"},
	"ふぇ": {"fuxe", "huxe", "fe", "fule", "hule"},
	"ふぉ": {"fo", "fuxo", "hulo", "fulo", "huxo"},
	"ふゃ": {"hulya", "fya", "fuxya", "fulya", "huxya"},
	"ふょ": {"fulyo", "huxyo", "fuxyo", "fyo", "hulyo"},
	"みゃ": {"mixya", "milya", "mya"},
	"みぃ": {"myi", "mili", "mixi"},
	"みゅ": {"myu", "milyu", "mixyu"},
	"みぇ": {"mile", "mixe", "mye"},
	"みょ": {"myo", "mixyo", "milyo"},
	"りゃ": {"rilya", "rixya", "rya"},
	"りぃ": {"rili", "rixi", "ryi"},
	"りゅ": {"rilyu", "rixyu", "ryu"},
	"りぇ": {"rixe", "rile", "rye"},
	"りょ": {"ryo", "rilyo", "rixyo"},
	"ぁ":  {"xa", "la"},
	"ぃ":  {"xi", "li"},
	"ぅ":  {"xu", "lu"},
	"ぇ":  {"xe", "le"},
	"ぉ":  {"xo", "lo"},
	"ゃ":  {"xya", "lya"},
	"ゅ":  {"xyu", "lyu"},
	"ょ":  {"xyo", "lyo"},
	"ゎ":  {"xwa", "lwa"},
	"っ":  {"xtu", "ltu"},
	"ー":  {"-"},
	"、":  {","},
	"。":  {"."},
	"？":  {"?"},
	"！":  {"!"},
	"〜":  {"~"},
	"（":  {"("},
	"）":  {")"},
	"「":  {"["},
	"」":  {"]"},
	"・":  {"/"},
	"　":  {" "},
}

func SplitTextForTyping(text string) []string {
	result := make([]string, 0, len([]rune(text)))
	runes := []rune(text)
	i := 0

	for i < len(runes) {
		if i < len(runes)-1 {
			// 2文字を切り出し
			twoChars := string(runes[i : i+2])
			if _, exists := RomajiMap[twoChars]; exists {
				result = append(result, twoChars)
				i += 2
			} else {
				result = append(result, string(runes[i:i+1]))
				i++
			}
		} else {
			result = append(result, string(runes[i:i+1]))
			i++
		}
	}
	return result
}

func KeyDown(c, s string, i int, questionArray []string) (string, int) {
	newText := s + c

	// 早期リターン：エラーチェック
	if len(questionArray) == 0 || i >= len(questionArray) {
		return "", i + 1 // 入力をクリアして次へ
	}

	question := questionArray[i]

	// 次の文字の取得とチェックを関数化
	getNextChar := func() (string, bool) {
		if i+1 < len(questionArray) {
			return questionArray[i+1], true
		}
		return "", false
	}

	// 入力成功時の処理を関数化
	success := func(increment int) (string, int) {
		return "", i + increment // 入力をクリアして指定数進める
	}

	switch question {
	case "っ":
		next, hasNext := getNextChar()
		if !hasNext {
			return success(1)
		}

		if words, exists := RomajiMap[next]; exists {
			// 促音のパターンを生成
			patterns := []string{"xtu", "ltu"}
			for _, word := range words {
				firstChar := word[:1]
				patterns = append(patterns, firstChar+word)
			}

			// パターンマッチング
			for _, pattern := range patterns {
				if strings.HasSuffix(newText, pattern) {
					if pattern == "xtu" || pattern == "ltu" {
						return success(1)
					}
					return success(2)
				}
			}
		}
		return newText, i // マッチしない場合は状態維持

	case "ん":
		next, hasNext := getNextChar()
		if !hasNext {
			if strings.HasSuffix(newText, "nn") {
				return success(1)
			}
			return newText, i
		}

		if words, exists := RomajiMap[next]; exists {
			needsNN := false
			for _, word := range words {
				firstChar := string(word[0])
				if strings.Contains("aiueony", firstChar) {
					needsNN = true
					break
				}
			}

			if needsNN && strings.HasSuffix(newText, "nn") {
				return success(1)
			}
			if !needsNN && strings.HasSuffix(newText, "n") {
				return success(1)
			}
		} else if strings.HasSuffix(newText, "nn") {
			return success(1)
		}
		return newText, i

	default:
		if words, exists := RomajiMap[question]; exists {
			for _, word := range words {
				if strings.HasSuffix(newText, word) {
					return success(1)
				}
			}
		} else if strings.HasSuffix(newText, question) {
			return success(1)
		}
		return newText, i
	}
}
