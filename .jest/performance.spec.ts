function data() {
    const data: string[] = []
    const white = parseInt('FFFFFF', 16)
    Array(white)
        .fill(0)
        .forEach((_, i) => {
            data.push(i.toString(16).padStart(6, '0'))
        })
    return data
}

function a(data: string) {
    const color = parseInt(data, 16)
    const red = (color >> 16) & 0xff
    const green = (color >> 8) & 0xff
    const blue = color & 0xff

    return [red, green, blue]
}

function b(data: string) {
    const color = parseInt(data, 16)
    const blue = color % 256
    const green = Math.floor((color - blue) / 256) % 256
    const red = Math.floor((color - green) / 65536) % 256

    return [red, green, blue]
}

function c(data: string) {
    const red = parseInt(data.slice(0, 2), 16)
    const green = parseInt(data.slice(2, 4), 16)
    const blue = parseInt(data.slice(4, 6), 16)

    return [red, green, blue]
}

function perform(data: string[], ...callback: ((data: string) => unknown)[]) {
    callback.forEach((cb) => {
        const startTime = performance.now()
        data.forEach((item) => cb(item))
        const endTime = performance.now()
        console.log(
            `Call to doSomething took ${endTime - startTime} milliseconds`,
        )
    })
}

test('test-function(): test case', async () => {
    const testData = data()
    perform(testData, a, b, c)
    expect(true).toBeTruthy()
})
