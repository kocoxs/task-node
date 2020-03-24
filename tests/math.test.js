const math = require('../src/math.js')

test('should calculate total plus tip', () => { 
    const total = math.calculateTip( 10, .3)
    
    expect(total).toBe(13)

    // if(total !== 13){
    //     throw new Error(`total tip deberia ser 13. got ${total} `)
    // }

})

test('calculando propina por defecto', () => {
    const total = math.calculateTip(10)
    expect(total).toBe(12.5)
})

test('farenheit to centigrados', () => {
    const centigrados = math.fahrenheitToCelsius(32)
    expect(centigrados).toBe(0)
})

test('centigrados para farenheit', () => {
    const centigrados = math.celsiusToFahrenheit(0)
    expect(centigrados).toBe(32)
})

// test('Async test demo', (done) => {
//     setTimeout(()=>{        
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })

test('Async test promesa add dos ', (done) => {

    math.add(2,3).then((result) => {
        expect(result).toBe(5)
        done()
    })
})

test('async / await', async ()=>{
    const sum = await math.add(10,22)
    expect(sum).toBe(32)
})