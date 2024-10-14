const seconds = 20
const randomTime = Math.floor(Math.random() * seconds) + 1
let index = 0

const timer = setInterval(() => {
    console.log(index)
    if (index === randomTime) {
        clearInterval(timer)
    }
    index++
}, 1000)
