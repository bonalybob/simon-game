'use strict'

// Set Up Game Object
let game = {
    counter: -1,
    pattern: [],
    userPattern: [],
    counts: false,
}

// Setup for Game to Start (UI and Background)
function setupGame () {
    game = {
        counter: -1,
        pattern: [],
        userPattern: [],
        counts: false,
    }
    document.getElementById('start-game').innerText = 'Restart'
    document.getElementById('message').setAttribute('style', 'display:none')
    nextStage()
}

// Reset for Next Stage, Show Flashes
function nextStage () {
    game.counter += 1
    game.counts = false
    game.userPattern = []
    game.pattern.push(randomColor())
    document.getElementById('score').setAttribute('style', 'display:inline-block')
    document.getElementById('score').innerText = 'Score: ' + game.counter.toString()
    if (game.counter > 19) winMessage()
    else flashPattern(game.pattern)
}

// On End of Game show Relevent Message
function winMessage () {
    game.counts = false
    document.getElementById('message').innerText = 'You Win!'
    document.getElementById('message').setAttribute('style', 'display:inline-block')
    document.getElementById('start-game').innerText = 'Play Again'
}

function failedMessage () {
    game.counts = false
    document.getElementById('message').innerText = 'Game Over!'
    document.getElementById('message').setAttribute('style', 'display:inline-block')
    document.getElementById('start-game').innerText = 'Start'
}

// Flashes Boxes in Pattern, (Flash and Sound). Delayed so they don't overlap
function flashBox (color, length = 500) {
    document.getElementById(color).setAttribute('class', 'flash box')
    setTimeout(() => {
        document.getElementById(color).setAttribute('class', 'box')
        document.getElementById(color + '-sound').play()
    }, length)
}

function flashPattern (pattern) {
    for (let item in pattern) {
        setTimeout(() => {
            flashBox(pattern[item])
            if (parseInt(item) === pattern.length - 1) game.counts = true
        }, 1000 * item)
    }
    return true
}

// Generate Random Item for Sequence
function randomColor () {
    const possibleColors = ['red', 'yellow', 'green', 'blue']
    const randomNumber = Math.floor(Math.random() * 4)
    return possibleColors[randomNumber]
}

// Compare User's Patttern to Generated Pattern
function checkPattern (pattern, userPattern) {
    for (let item in userPattern) {
        if (pattern[item] !== userPattern[item]) return 'Incorrect'
    }
    if (pattern.length === userPattern.length) return 'Match'
    else return 'Correct'
}

// On Box Click
function boxClick () {
    clearTimeout()
    flashBox(this.id, 250)
    if (game.counts) {
        game.userPattern.push(this.id)
        let checked = checkPattern(game.pattern, game.userPattern)
        if (checked === 'Incorrect') failedMessage()
        else if (checked === 'Match') setTimeout(nextStage, 1000)
    }
}

// Set Bindings to the Buttons and Elements
document.getElementById('red').addEventListener('click', boxClick)
document.getElementById('yellow').addEventListener('click', boxClick)
document.getElementById('green').addEventListener('click', boxClick)
document.getElementById('blue').addEventListener('click', boxClick)

document.getElementById('start-game').addEventListener('click', setupGame)
