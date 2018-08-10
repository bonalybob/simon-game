// falsh Boxes in Pattern
function flashBox (color) {
    document.getElementById(color).setAttribute('class', 'flash box')
    setTimeout(() => {
        document.getElementById(color).setAttribute('class', 'box')
    }, 500)
}

function flashPattern (pattern) {
    for (let item in pattern) {
        setTimeout(() => {
            flashBox(pattern[item])
            if (parseInt(item) === pattern.length - 1) {
                game.counts = true
            }
        }, 1000 * item)
    }
    return true
}

function randomColor () {
    const possibleColors = ['red', 'yellow', 'green', 'blue']
    const randomNumber = Math.floor(Math.random() * 4)
    return possibleColors[randomNumber]
}

// Show Flashes
function nextStage () {
    game.counter += 1
    game.counts = false
    game.userPattern = []
    game.pattern.push(randomColor())
    flashPattern(game.pattern)
}

// On Box Click
function buttonClick () {
    if (game.counts) {
        game.userPattern.push(this.id)
        let checked = checkPattern(game.pattern, game.userPattern)
        if (checked === 'Incorrect') failedMessage()
        else if (checked === 'Match') nextStage()
    }
    else {
        failedMessage()
    }
}

document.getElementById('red').addEventListener('click', buttonClick)
document.getElementById('yellow').addEventListener('click', buttonClick)
document.getElementById('green').addEventListener('click', buttonClick)
document.getElementById('blue').addEventListener('click', buttonClick)

// Compare User to Generated
function checkPattern (pattern, userPattern) {
    for (let item in userPattern) {
        if (pattern[item] !== userPattern[item]) return 'Incorrect'
    }
    if (pattern.length === userPattern.length) return 'Match'
    else return 'Correct'
}

// On Game Over
function failedMessage () {
    game.counts = false
    let message = document.getElementById('message')
    message.setAttribute('style', 'display:block')
    message.innerText = 'Game Over! You Scored: ' + game.counter
}

// Set Up Game
let game = {}

document.getElementById('start-game').addEventListener('click', () => {
    game = {
        counter: -1,
        pattern: [],
        userPattern: [],
    }
    document.getElementById('message').setAttribute('style', 'display:none')
    nextStage()
})

