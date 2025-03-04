const ellipses = document.querySelectorAll('.ellipse')
const delayBetweenFrames = 100
const delayAfterFullLoop = 750

function animateEllipses() {
    if (!loadingBox.classList.contains('show')) clearInterval(loop)

    // Punkte nacheinander aktivieren
    ellipses.forEach((dot, index) => {
        setTimeout(() => {
            dot.classList.add('active')

            // Erst wenn der letzte Punkt aktiv ist, beginnt das Deaktivieren in gleicher Reihenfolge
            if (index === ellipses.length - 1) {
                ellipses.forEach((dot, removeIndex) => {
                    setTimeout(() => {
                        dot.classList.remove('active')
                    }, removeIndex * delayBetweenFrames)
                })
            }
        }, index * delayBetweenFrames)
    })
}

// Starte Animation und wiederhole sie in Intervallen
const loop = setInterval(animateEllipses, ellipses.length * delayBetweenFrames * 2 + delayAfterFullLoop)

// Direkt beim Laden starten
animateEllipses()
