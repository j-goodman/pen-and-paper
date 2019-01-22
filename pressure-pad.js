let canvas = null
let ctx = null
let mousedown = false
let pen = {
    color: '#fff',
    erase: false,
    weight: 6
}
let marks = []

window.addEventListener('load', () => {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    canvas.addEventListener('pointermove', canvasClick)
    window.addEventListener('gotpointercapture', () => {
        mousedown = true
    })
    window.addEventListener('lostpointercapture', () => {
        if (marks.length > 0) {
            recorder.bank.push(marks)
            marks = []
        }
        mousedown = false
    })
    setupPenControls()
})

let setupPenControls = () => {
    let penWeight = document.getElementById('pen-weight')
    penWeight.addEventListener('keyup', () => {
        pen.weight = parseFloat(penWeight.value)
    })
    let penColor = document.getElementById('pen-color')
    penColor.addEventListener('keyup', () => {
        pen.color = penColor.value
    })
    let penErase = document.getElementById('pen-erase')
    penErase.addEventListener('click', () => {
        pen.erase = penErase.checked
    })
    let clearCanvas = document.getElementById('clear-canvas')
    clearCanvas.addEventListener('click', () => {
        clearAll()
    })
}

let canvasClick = event => {
    if (mousedown) {
        makeMark(event)
    }
}

let clearAll = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

let makeMark = event => {
    let pressure = event.pressure || .75
    let radius = pen.weight * pressure
    mark(event.offsetX, event.offsetY, radius)
}

let mark = (x, y, radius) => {
    if (pen.erase) {
        eraseRect(x, y, radius)
    } else {
        drawCircle(x, y, radius)
    }
    marks.push({x: x, y: y, radius: radius, time: Date.now()})
    if (marks.length > 1) {
        fillBreak(marks[marks.length - 1], marks[marks.length - 2], radius)
    }
}

let fillBreak = (a, b, radius) => {
    if (checkForBreak(a, b, average(a.radius, b.radius))) {
        let point = {
            x: average(a.x, b.x),
            y: average(a.y, b.y),
            radius: average(a.radius, b.radius)
        }
        if (pen.erase) {
            eraseRect(point.x, point.y, average(a.radius, b.radius))
        } else {
            drawCircle(point.x, point.y, average(a.radius, b.radius))
        }
        fillBreak(a, point, radius)
        fillBreak(point, b, radius)
    }
}

let average = (a, b) => {
    return (a + b) / 2
}

let distanceBetween = (pointA, pointB) => {
    let a = pointA.x - pointB.x;
    let b = pointA.y - pointB.y;
    return Math.sqrt( a*a + b*b );
}

let checkForBreak = (a, b, radius) => {
    let strictness = 1 // value between 0 and 1
    return distanceBetween(a, b) > radius / strictness
}

let drawCircle = (centerX, centerY, radius) => {
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = pen.color
    ctx.fill()
}

let eraseRect = (centerX, centerY, radius) => {
    ctx.beginPath()
    radius *= 4
    ctx.clearRect(centerX - radius/2, centerY - radius/2, radius, radius)
}
