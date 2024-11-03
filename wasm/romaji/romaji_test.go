package romaji

import (
	"fmt"
	"testing"
)

// func TestSplitTextForTyping(t *testing.T) {
// 	for _, v := range []string{"あきょう", "hello こんにちは", "", "しゃしん", "ちぇるのびゅいりゅ"} {
// 		got := SplitTextForTyping(v)
// 		fmt.Println(got)
// 	}
// }

func TestKeyDown(t *testing.T) {
	a, b, c := KeyDown("o", "zzzkk", 1, []string{"ら", "っ", "こ"})
	fmt.Println(a)
	fmt.Println(b)
	fmt.Println(c)

	a, b, c = KeyDown("i", "r", 0, []string{"り", "ん", "ご"})
	fmt.Println(a)
	fmt.Println(b)
	fmt.Println(c)

	a, b, c = KeyDown("a", "xxx", 2, []string{"i", "s", "a"})
	fmt.Println(a)
	fmt.Println(b)
	fmt.Println(c)
}
