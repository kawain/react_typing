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
              .filter(row => row.length === 2)
              .map(([japanese, hiragana]) => ({
                japanese,
                hiragana
              }))

            const shuffled = shuffleArray(parsedQuestions)
            setQuestions(shuffled)
            setCurrentQuestion(shuffled[0])
            let mondai = shuffled[0].hiragana
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
    const moji = e.key
    const newInputText = inputText + moji
    let nowQuestionTextIndex = questionTextIndex
    const question = questionTextArray[questionTextIndex]

    if (question in RomajiConversion) {
      // 促音の「っ」
      if (question === 'っ') {
        const newArr = [...RomajiConversion[question]]
        const next = questionTextArray[questionTextIndex + 1]
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
      } else if (
        question === 'ん' &&
        questionTextArray.length - 1 === nowQuestionTextIndex
      ) {
        // 最後の「ん」
        if (newInputText.endsWith('nn')) {
          setInputText('')
          nowQuestionTextIndex++
        }
      } else {
        // RomajiConversionにある他のもの
        for (const v of RomajiConversion[question]) {
          if (newInputText.endsWith(v)) {
            setInputText('')
            nowQuestionTextIndex++
            break
          }
        }
      }
    } else {
      // RomajiConversionにないもの
      if (newInputText.endsWith(question)) {
        setInputText('')
        nowQuestionTextIndex++
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
    let mondai = questions[nextIndex].hiragana
    let result = SplitTextForTyping(mondai)
    setQuestionTextArray(result)
    divRef.current.focus()
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
            <p style={{ fontSize: '24px', marginBottom: '20px' }}>
              {currentQuestion.japanese}
            </p>
            <p>
              {questionTextArray.map((char, index) => (
                <span
                  key={index}
                  style={{
                    color: index < questionTextIndex ? '#2ecc71' : 'black'
                  }}
                >
                  {char}
                </span>
              ))}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default TypingPractice
