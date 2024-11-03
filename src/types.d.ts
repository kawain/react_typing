declare global {
  interface Window {
    Go: any
    splitText: (text: string) => string[]
    keyDown: (
      char: string,
      text: string,
      index: number,
      questionArray: string[]
    ) => {
      newText: string
      newIndex: number
    }
  }
}

export {}
