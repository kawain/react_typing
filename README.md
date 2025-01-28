# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## データは pykakasi でひらがなにする

kanjiconv の方がいい

```bash
# pip install pykakasi

pip install kanjiconv
```

## GitHub Pages へのデプロイ

```bash
npm run deploy
```

## AIのプロンプト

以下のテキストを１行ずつ処理して欲しい。

処理内容は、
- ひらがなはそのままにする
- 漢字はひらがなにする(自然なよみがなにする)
- カタカナもひらがなにする
- 英語、数字、記号はそのままにする

例1：2台の車が事故に巻き込まれました。
2だいのくるまがじこにまきこまれました。

例2：10ドルは1,500円と同等です
10どるは1,500えんとどうとうです

出力形式は、
テキストの番号. 処理結果(改行)
でお願いします。

テキスト
4651. 私が知る限り、電車はあと10分くらいで到着するはずです。
4652. 私が知る限り、店は日曜日は休みです。
4653. 楽しみにしています。
4654. あなたの返信を楽しみにしています。
4655. 私の休暇をとても楽しみにしています。
4656. 週末を楽しみにしています。
4657. あなたに会えるのを楽しみにしています。
4658. あなたに何かを理解してほしい。
4659. 私が部屋を掃除するのを手伝ってほしい。
4660. 私を駅まで連れて行ってほしい。
4661. あなたには正直であって欲しい。

