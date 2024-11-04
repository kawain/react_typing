import React, { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'

function TypingPractice () {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [attemptCount, setAttemptCount] = useState(1)
  const [questionTextArray, setQuestionTextArray] = useState([])
  const [questionTextIndex, setQuestionTextIndex] = useState(0)
  const [inputText, setInputText] = useState('')
  const divRef = useRef(null)
  const [wasmLoaded, setWasmLoaded] = useState(false)

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
        const response = await fetch('./questions.csv')
        const csvData = await response.text()

        Papa.parse(csvData, {
          complete: results => {
            const parsedQuestions = results.data
              .filter(row => row.length === 3)
              .map(([english, japanese, hiragana]) => ({
                english,
                japanese,
                hiragana
              }))

            const shuffled = shuffleArray(parsedQuestions)
            setQuestions(shuffled)
            setCurrentQuestion(shuffled[0])
            let mondai = `${shuffled[0].english} ${shuffled[0].hiragana}`
            let result = window.splitText(mondai)
            setQuestionTextArray(result)
          },
          header: false,
          skipEmptyLines: true
        })
      } catch (error) {
        console.error('CSVの読み込みに失敗しました:', error)
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

    divRef.current.focus()
  }

  const speakText = text => {
    const uttr = new SpeechSynthesisUtterance()
    uttr.text = text
    uttr.lang = 'en-US'
    uttr.rate = 1.0
    uttr.pitch = 1.0
    uttr.volume = 1.0
    speechSynthesis.speak(uttr)
    divRef.current.focus()
  }

  return (
    <div className='typing'>
      <h2>タイピング練習</h2>
      <div className='stats'>
        <p>{attemptCount}回目</p>
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
          Tabキーを押すか、問題文をクリックで入力できるようになります。
          <br />
          問題文下線部をクリックするとブラウザの機能で読み上げます。
          <br />
          ←: 前の問題
          <br />
          →: 次の問題
        </p>
      </div>
    </div>
  )
}

export default TypingPractice
