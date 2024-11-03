import React, { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'
import { RomajiConversion, SplitTextForTyping } from './SplitText'

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
    if (!wasmLoaded) return // WASM読み込み待ち

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
            // WASMの関数を使用
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
  }, [wasmLoaded]) // 依存配列にwasmLoadedを追加

  useEffect(() => {
    if (divRef.current && currentQuestion) {
      divRef.current.focus()
    }
  }, [currentQuestion])

  const handleKeyDown = e => {
    e.preventDefault()

    // WASMが読み込まれていない場合は処理しない
    if (!wasmLoaded) return

    const moji = e.key
    const nowQuestionTextArray = questionTextArray

    // WASM関数呼び出し
    try {
      const result = window.keyDown(
        moji, // 入力された文字
        inputText, // 現在の入力テキスト
        questionTextIndex, // 現在のインデックス
        nowQuestionTextArray // 問題の配列
      )

      // 結果の反映
      setInputText(result.setInputText)
      setQuestionTextIndex(result.newIndex)

      // 問題が終わったかチェック
      if (questionTextArray.length - 1 < result.newIndex) {
        setTimeout(() => {
          nextQuestion()
        }, 200)
      }
    } catch (error) {
      console.error('WASM関数呼び出しエラー:', error)
    }
  }

  const nextQuestion = () => {
    const currentIndex = questions.indexOf(currentQuestion)
    const nextIndex = (currentIndex + 1) % questions.length
    setCurrentQuestion(questions[nextIndex])
    setAttemptCount(prev => prev + 1)
    setInputText('')
    setQuestionTextIndex(0)
    let mondai = `${questions[nextIndex].english} ${questions[nextIndex].hiragana}`
    let result = SplitTextForTyping(mondai)
    setQuestionTextArray(result)
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
  }

  return (
    <div className='typing'>
      <h2>タイピング練習</h2>
      <div className='stats'>
        <p>{attemptCount}回目</p>
      </div>
      {currentQuestion && (
        <>
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
        </>
      )}
    </div>
  )
}

export default TypingPractice
