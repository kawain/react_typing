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
            let result = SplitTextForTyping(mondai)
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
  }, [])

  useEffect(() => {
    if (divRef.current && currentQuestion) {
      divRef.current.focus()
    }
  }, [currentQuestion])

  const handleKeyDown = e => {
    e.preventDefault()
    const moji = e.key
    const newInputText = inputText + moji
    let nowQuestionTextIndex = questionTextIndex
    const question = questionTextArray[questionTextIndex]

    if (question === 'っ') {
      // 促音の「っ」
      const next = questionTextArray[questionTextIndex + 1]
      if (next in RomajiConversion) {
        const newArr = ['xtu', 'ltu']
        // 次の子音を重ねる
        for (const v of RomajiConversion[next]) {
          newArr.push(`${v[0]}${v}`)
        }
        for (const v of newArr) {
          if (newInputText.endsWith(v)) {
            setInputText('')
            if (v === 'xtu' || v === 'ltu') {
              nowQuestionTextIndex++
            } else {
              nowQuestionTextIndex += 2
            }
            break
          }
        }
      } else {
        // 問題文エラー
        setInputText('')
        nowQuestionTextIndex++
      }
    } else if (question === 'ん') {
      // 「ん」がnかnnか問題
      const next = questionTextArray[questionTextIndex + 1]
      if (next in RomajiConversion) {
        for (const v of RomajiConversion[next]) {
          if ('aiueo'.includes(v[0])) {
            // 次の文字があ行
            if (newInputText.endsWith('nn')) {
              setInputText('')
              nowQuestionTextIndex++
              break
            }
          } else if ('n' === v[0]) {
            // 次の文字がな行
            if (newInputText.endsWith('nn')) {
              setInputText('')
              nowQuestionTextIndex++
              break
            }
          } else if ('y' === v[0]) {
            // 次の文字がや行
            if (newInputText.endsWith('nn')) {
              setInputText('')
              nowQuestionTextIndex++
              break
            }
          } else {
            if (newInputText.endsWith('n')) {
              setInputText('')
              nowQuestionTextIndex++
              break
            }
          }
        }
      } else {
        if (newInputText.endsWith('nn')) {
          setInputText('')
          nowQuestionTextIndex++
        }
      }
    } else {
      if (question in RomajiConversion) {
        // RomajiConversionにある他のもの
        for (const v of RomajiConversion[question]) {
          if (newInputText.endsWith(v)) {
            setInputText('')
            nowQuestionTextIndex++
            break
          }
        }
      } else {
        // RomajiConversionにないもの
        if (newInputText.endsWith(question)) {
          setInputText('')
          nowQuestionTextIndex++
        }
      }
    }

    setInputText(newInputText)
    setQuestionTextIndex(nowQuestionTextIndex)

    if (questionTextArray.length - 1 < nowQuestionTextIndex) {
      setTimeout(() => {
        nextQuestion()
      }, 200)
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
