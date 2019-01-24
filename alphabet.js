let drawLetterGuide = () => {
    ctx.strokeStyle = '#fff'
    ctx.rect(4, 4, 30, 45)
    ctx.stroke()
}

// let poem = ('The time has come, the/walrus said,//to speak of many things.//of shoes and ships and/sealing wax, of cabbages/and kings.//of why the sea is boiling/hot,//and whether pigs have wings.')
let excerpt = `The pair walked on again for a while in silence; and then "Enfield," said Mr. Utterson, "that's a good rule of yours."

"Yes, I think it is," returned Enfield.

"But for all that," continued the lawyer, "there's one point I want to ask: I want to ask the name of that man who walked over the child."

"Well," said Mr. Enfield, "I can't see what harm it would do. It was a man of the name of Hyde."`

let write = message => {
    let saved = JSON.parse(localStorage.getItem('storedDrawings'))
    playbackSettings.speed = .036
    playbackSettings.scale = .53
    Array.from(message).map((char, index) => {
        setTimeout(() => {
            if (atEndOfLine(message, index)) {
                playbackSettings.anchorX = 0
                playbackSettings.anchorY += 60 * playbackSettings.scale
            }
            if (saved[char.toUpperCase()]) {
                repeatBank(saved[char.toUpperCase()])
                playbackSettings.anchorX += 30 * playbackSettings.scale
            } else if (char === '\n' || char === '/') {
                playbackSettings.anchorX = 0
                playbackSettings.anchorY += 60 * playbackSettings.scale
            } else {
                playbackSettings.anchorX += 30 * playbackSettings.scale
            }
        }, index * 3200 * playbackSettings.speed)
    })
}

let atEndOfLine = (message, index) => {
    let restOfWord = message.slice(index, message.length).split(' ')[0]
    restOfWord = restOfWord.split('\n')[0]
    return playbackSettings.anchorX > canvas.width - 30 * playbackSettings.scale * restOfWord.length
}

// window.addEventListener('load', drawLetterGuide)
