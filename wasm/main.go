//go:build js && wasm

package main

import (
	"react_typing/wasm/romaji"
	"syscall/js"
)

// KeyDownのラッパー関数
func keyDownWrapper(this js.Value, args []js.Value) any {
	if len(args) < 4 {
		return nil
	}

	// 引数を取得
	c := args[0].String()      // 入力された文字
	s := args[1].String()      // 現在のテキスト
	i := args[2].Int()         // インデックス
	questionArrayJS := args[3] // 問題の配列

	// JavaScriptの配列をGoのスライスに変換
	questionArray := make([]string, questionArrayJS.Length())
	for i := 0; i < questionArrayJS.Length(); i++ {
		questionArray[i] = questionArrayJS.Index(i).String()
	}

	// KeyDown関数を実行
	newText, newIndex := romaji.KeyDown(c, s, i, questionArray)

	// 結果をJavaScriptのオブジェクトとして返す
	result := map[string]interface{}{
		"newText":  newText,
		"newIndex": newIndex,
	}

	return js.ValueOf(result)
}

// WASMから呼び出し可能な形式に変更
func splitTextWrapper(this js.Value, args []js.Value) any {
	if len(args) < 1 {
		return nil
	}

	// 第1引数を文字列として取得
	text := args[0].String()

	// 元の処理を実行
	result := romaji.SplitTextForTyping(text)

	// JavaScriptの配列に変換
	jsArray := make([]interface{}, len(result))
	for i, v := range result {
		jsArray[i] = v
	}

	// js.ValueOfを使ってJavaScript値に変換
	return js.ValueOf(jsArray)
}

func main() {
	// ラッパー関数を登録
	js.Global().Set("splitText", js.FuncOf(splitTextWrapper))
	js.Global().Set("keyDown", js.FuncOf(keyDownWrapper))

	// プログラムを終了させない
	select {}
}
