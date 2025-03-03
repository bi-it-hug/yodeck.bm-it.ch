const dots = document.querySelectorAll('.dot')
const delayBetweenFrames = 100
const delayAfterFullLoop = 750

function animateDots() {
    if (!loading.classList.contains('show')) clearInterval(loop)

    // Punkte nacheinander aktivieren
    dots.forEach((dot, index) => {
        setTimeout(() => {
            dot.classList.add('active')

            // Erst wenn der letzte Punkt aktiv ist, beginnt das Deaktivieren in gleicher Reihenfolge
            if (index === dots.length - 1) {
                dots.forEach((dot, removeIndex) => {
                    setTimeout(() => {
                        dot.classList.remove('active')
                    }, removeIndex * delayBetweenFrames)
                })
            }
        }, index * delayBetweenFrames)
    })
}

// Starte Animation und wiederhole sie in Intervallen
const loop = setInterval(animateDots, dots.length * delayBetweenFrames * 2 + delayAfterFullLoop)

// Direkt beim Laden starten
animateDots()
