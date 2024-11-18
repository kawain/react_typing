import React, { useState, useEffect, useRef } from 'react'

function TypingPractice () {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [attemptCount, setAttemptCount] = useState(1)
  const [questionTextArray, setQuestionTextArray] = useState([])
  const [questionTextIndex, setQuestionTextIndex] = useState(0)
  const [inputText, setInputText] = useState('')
  const divRef = useRef(null)
  const [wasmLoaded, setWasmLoaded] = useState(false)
  const [isSound, setIsSound] = useState(false)

  const shuffleArray = array => {
    // 配列のコピーを作成
    const newArray = [...array]
    // Fisher-Yatesシャッフルアルゴリズム
    for (let i = newArray.length - 1; i > 0; i--) {
      // より強力な乱数生成
      const j = Math.floor(
        (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) *
          (i + 1)
      )
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const go = new window.Go()
        const result = await WebAssembly.instantiateStreaming(
          fetch('./main.wasm'),
          go.importObject
        )
        go.run(result.instance)
        setWasmLoaded(true)
      } catch (error) {
        console.error('WASMの読み込みに失敗しました:', error)
      }
    }

    loadWasm()
  }, [])

  useEffect(() => {
    if (!wasmLoaded) return

    const loadQuestions = async () => {
      try {
        const response = await fetch('./questions.txt')
        const text = await response.text()

        // テキストを行ごとに分割し、空行を除外
        const lines = text.split('\n').filter(line => line.trim())
        // 各行を★で分割してオブジェクトに変換
        const questions = lines.map(line => {
          const [english, japanese, hiragana] = line.split('★')
          return {
            english,
            japanese,
            hiragana
          }
        })

        const shuffled = shuffleArray(questions)
        shuffled.unshift({
          english: 'abcdefghijklmnopqrstuvwxyz',
          japanese: '1234567890',
          hiragana: '1234567890'
        })
        setQuestions(shuffled)
        setCurrentQuestion(shuffled[0])
        let mondai = `${shuffled[0].english} ${shuffled[0].hiragana}`
        let result = window.splitText(mondai)
        setQuestionTextArray(result)
      } catch (error) {
        console.error('ファイルの読み込みに失敗しました:', error)
      }
    }
    loadQuestions()
  }, [wasmLoaded])

  const handleKeyDown = e => {
    e.preventDefault()

    if (!wasmLoaded) return

    const moji = e.key

    if (moji === 'ArrowRight') {
      nextQuestion(1)
      return
    } else if (moji === 'ArrowLeft') {
      nextQuestion(-1)
      return
    }

    try {
      const result = window.keyDown(
        moji,
        inputText,
        questionTextIndex,
        questionTextArray
      )

      setInputText(result.newText)
      setQuestionTextIndex(result.newIndex)

      // 問題が終わったかチェック
      if (questionTextArray.length - 1 < result.newIndex) {
        setTimeout(() => {
          nextQuestion(1)
        }, 200)
      }
    } catch (error) {
      console.error('WASM関数呼び出しエラー:', error)
    }
  }

  const nextQuestion = num => {
    // 現在のインデックスを取得
    const currentIndex = questions.indexOf(currentQuestion)

    // 新しいインデックスを計算（境界チェック付き）
    let nextIndex
    if (num > 0) {
      // 次に進む場合
      nextIndex =
        currentIndex + num >= questions.length ? 0 : currentIndex + num
    } else {
      // 前に戻る場合
      nextIndex =
        currentIndex + num < 0 ? questions.length - 1 : currentIndex + num
    }

    // 次の問題をセット
    setCurrentQuestion(questions[nextIndex])
    setAttemptCount(nextIndex + 1)

    setInputText('')
    setQuestionTextIndex(0)

    let mondai = `${questions[nextIndex].english} ${questions[nextIndex].hiragana}`

    if (wasmLoaded) {
      try {
        let result = window.splitText(mondai)
        setQuestionTextArray(result)
      } catch (error) {
        console.error('問題文の分割に失敗しました:', error)
      }
    }

    // 読み上げ
    speakText(questions[nextIndex].english)

    divRef.current.focus()
  }

  const speakText = text => {
    if (isSound) {
      const uttr = new SpeechSynthesisUtterance()
      uttr.text = text
      uttr.lang = 'en-US'
      uttr.rate = 1.0
      uttr.pitch = 1.0
      uttr.volume = 1.0
      speechSynthesis.speak(uttr)
    }
    divRef.current.focus()
  }

  return (
    <div className='typing'>
      <h2>英語学習用タイピング</h2>
      <div className='stats'>
        <p>{attemptCount}番目</p>
      </div>
      {currentQuestion && (
        <div
          className='question'
          tabIndex={0}
          onKeyDown={handleKeyDown}
          ref={divRef}
        >
          <p className='questionArray'>
            {questionTextArray.map((char, index) => (
              <span
                key={index}
                data-typed={index < questionTextIndex ? 'true' : 'false'}
              >
                {char}
              </span>
            ))}
          </p>
          <p className='questionText'>
            <a
              href='#'
              onClick={e => {
                e.preventDefault()
                speakText(currentQuestion.english)
              }}
            >
              {currentQuestion.english}
            </a>{' '}
            {currentQuestion.japanese}
          </p>
        </div>
      )}
      <div className='explanation'>
        <p>
          Tabキーを押すか問題文をクリックすることでタイピングできるようになります。
          問題文下線部をクリックすると（音声が有効の場合）読み上げます。
        </p>
        <div className='control'>
          <p>←: 前の問題、→: 次の問題</p>
          <p>
            <label>
              <input
                type='checkbox'
                checked={isSound}
                onChange={e => {
                  setIsSound(e.target.checked)
                  divRef.current.focus()
                }}
              />
              音声を有効にする
            </label>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TypingPractice
