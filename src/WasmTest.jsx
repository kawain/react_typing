import { useEffect, useState } from 'react'

function WasmTest() {
    const [result, setResult] = useState(0)
    
    useEffect(() => {
        const loadWasm = async () => {
            const go = new Go()
            const result = await WebAssembly.instantiateStreaming(
                fetch('./main.wasm'),
                go.importObject
            )
            go.run(result.instance)
        }
        loadWasm()
    }, [])

    const handleCalculate = () => {
        // wasmAddはグローバルに登録された関数
        const sum = window.wasmAdd(5, 3)
        setResult(sum)
    }

    return (
        <div>
            <button onClick={handleCalculate}>計算実行</button>
            <p>結果: {result}</p>
        </div>
    )
}

export default WasmTest
