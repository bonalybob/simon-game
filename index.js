'use strict'

// Set up Web Audio API for Sounds
let audioContext = new (window.AudioContext || window.webkitAudioContext || false)()
if (!audioContext) {
    document.getElementById('sound-error').setAttribute('style', 'display:block')
}
let frequencies = { 'green': 329.63, 'red': 261.63, 'yellow': 220, 'blue': 164.81 }
let oscillators = {}

Object.keys(frequencies).forEach((color) => {
    let oscillator = audioContext.createOscillator()
    oscillator.type = 'square'
    oscillator.frequency.value = frequencies[color]
    let gain = audioContext.createGain()
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    gain.gain.value = 0
    oscillator.start(0.0)
    oscillators[color] = gain
})

function colorTone (color, generated) {
    if (generated) {
        oscillators[color].gain.linearRampToValueAtTime(1, audioContext.currentTime)
        oscillators[color].gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5)
    }
    else oscillators[color].gain.linearRampToValueAtTime(0.5, audioContext.currentTime)
}

function errorTone () {
    let errorOscillator = audioContext.createOscillator()
    errorOscillator.type = 'triangle'
    errorOscillator.frequency.value = 110
    errorOscillator.connect(audioContext.destination)
    errorOscillator.start(0.0)
    errorOscillator.stop(audioContext.currentTime + 1.2)
}

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
    errorTone()
    clearTimeout()
    document.getElementById('message').innerText = 'Game Over!'
    document.getElementById('message').setAttribute('style', 'display:inline-block')
    document.getElementById('start-game').innerText = 'Start'
}

// Flashes Boxes in Pattern, (Flash and Sound). Delayed so they don't overlap
function flashBox (color, generated) {
    document.getElementById(color).setAttribute('class', 'flash box')
    if (generated) {
        colorTone(color, true)
        setTimeout(() => document.getElementById(color).setAttribute('class', 'box'), 500)
    }
    else colorTone(color, false)
}

function flashPattern (pattern) {
    for (let item in pattern) {
        setTimeout(() => {
            flashBox(pattern[item], true)
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
    flashBox(this.id, false)
}

function boxRelease () {
    oscillators[this.id].gain.linearRampToValueAtTime(0, audioContext.currentTime)
    document.getElementById(this.id).setAttribute('class', 'box')
    if (game.counts) {
        game.userPattern.push(this.id)
        let checked = checkPattern(game.pattern, game.userPattern)
        if (checked === 'Incorrect') failedMessage()
        else if (checked === 'Match') setTimeout(nextStage, 1000)
    }
}

// Set Bindings to the Buttons and Elements
document.getElementById('red').addEventListener('mousedown', boxClick)
document.getElementById('yellow').addEventListener('mousedown', boxClick)
document.getElementById('green').addEventListener('mousedown', boxClick)
document.getElementById('blue').addEventListener('mousedown', boxClick)

document.getElementById('red').addEventListener('click', boxRelease)
document.getElementById('yellow').addEventListener('click', boxRelease)
document.getElementById('green').addEventListener('click', boxRelease)
document.getElementById('blue').addEventListener('click', boxRelease)

document.getElementById('start-game').addEventListener('click', setupGame)
