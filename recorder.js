let recorder = {
    bank: []
}

let playbackSettings = {
    speed: .5,
    anchorX: 0,
    anchorY: 0,
    scale: 1,
}

let loadSavedDrawings = () => {
    let bank = document.getElementsByClassName('saved-drawings')[0]
    if (!localStorage.getItem('storedDrawings')) {
        localStorage.setItem('storedDrawings', JSON.stringify({}))
    }
    let drawings = JSON.parse(localStorage.getItem('storedDrawings'))
    Object.keys(drawings).forEach(name => {
        let drawing = document.createElement('li')
        let trash = document.createElement('div')
        trash.addEventListener('click', () => {
            delete drawings[name]
            localStorage.setItem('storedDrawings', JSON.stringify(drawings))
            clearSavedDrawings()
            loadSavedDrawings()
        })
        trash.innerText = '🗑'
        trash.className = 'trash-button'
        drawing.className = 'saved-drawing'
        drawing.innerText = name
        drawing.appendChild(trash)
        drawing.addEventListener('click', () => {
            repeatBank(drawings[name])
        })
        bank.appendChild(drawing)
    })
}

let clearSavedDrawings = () => {
    let bank = document.getElementsByClassName('saved-drawings')[0]
    Array.from(bank.children).forEach(item => {
        if (item.className.includes('saved-drawing')) {
            bank.removeChild(item)
        }
    })
}

let setupRecordingControls = () => {
    let newDrawing = document.getElementById('new-drawing')
    newDrawing.addEventListener('click', () => {
        recorder.bank = []
    })
    let saveDrawing = document.getElementById('save-drawing')
    saveDrawing.addEventListener('click', () => {
        saveRecording(prompt('Name your drawing:'))
        clearSavedDrawings()
        loadSavedDrawings()
    })
    let playbackSpeed = document.getElementById('playback-speed')
    playbackSpeed.addEventListener('keyup', () => {
        let value = parseFloat(playbackSpeed.value)
        value = value > 100 ? 100 : value
        value = value < 0 ? 0 : value
        playbackSettings.speed = value / 100
    })
    let xOffset = document.getElementById('x-offset')
    xOffset.addEventListener('keyup', () => {
        playbackSettings.anchorX = parseFloat(xOffset.value)
    })
    let yOffset = document.getElementById('y-offset')
    yOffset.addEventListener('keyup', () => {
        playbackSettings.anchorY = parseFloat(yOffset.value)
    })
    let scale = document.getElementById('playback-scale')
    scale.addEventListener('keyup', () => {
        playbackSettings.scale = parseFloat(scale.value)
    })
}

window.addEventListener('load', loadSavedDrawings)
window.addEventListener('load', setupRecordingControls)

let startRecording = () => {
    recorder.bank = []
}

let saveRecording = drawingName => {
    let storedDrawings = {}
    if (localStorage.getItem('storedDrawings')) {
        storedDrawings = JSON.parse(localStorage.getItem('storedDrawings'))
    }
    storedDrawings[drawingName] = recorder.bank
    localStorage.setItem('storedDrawings', JSON.stringify(storedDrawings))
    recorder.bank = []
}

let repeatBank = (bank) => { // speed is a value between 0 and 1
    let start = bank[0][0].time
    let speed = playbackSettings.speed
    let anchorX = playbackSettings.anchorX
    let anchorY = playbackSettings.anchorY
    let scale = playbackSettings.scale
    bank.forEach(stroke => {
        stroke.forEach((point, index) => {
            setTimeout(() => {
                mark(point.x * scale + anchorX, point.y * scale + anchorY, point.radius)
                if (index === stroke.length - 1) {
                    marks = []
                }
            }, (point.time - start) * speed)
        })
    })
}

let repeatLastStroke = speed => {
    repeatStroke(recorder.bank[recordedMarks.length - 1], speed)
}
