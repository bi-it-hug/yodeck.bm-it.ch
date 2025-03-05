const circles = document.querySelectorAll('.circle')
const showCircleClass = 'show-circle'
const delayBetweenFrames = 100
const delayAfterFullLoop = 750

function animateEllipses() {
    if (!loadingBox.classList.contains('show')) clearInterval(loop)

    // Punkte nacheinander aktivieren
    circles.forEach((circle, index) => {
        setTimeout(() => {
            circle.classList.add(showCircleClass)

            // Erst wenn der letzte Punkt aktiv ist, beginnt das Deaktivieren in gleicher Reihenfolge
            if (index === circles.length - 1) {
                circles.forEach((circle, removeIndex) => {
                    setTimeout(() => {
                        circle.classList.remove(showCircleClass)
                    }, removeIndex * delayBetweenFrames)
                })
            }
        }, index * delayBetweenFrames)
    })
}

// Starte Animation und wiederhole sie in Intervallen
const loop = setInterval(animateEllipses, circles.length * delayBetweenFrames * 2 + delayAfterFullLoop)

// Direkt beim Laden starten
animateEllipses()
