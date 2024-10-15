const dateElement = document.getElementById('dateElement')
const now = new Date()

const weekdays = [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
    'Sonntag'
]

const months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Huni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
]

dateElement.textContent = `
    ${weekdays[now.getDay() - 1]},
    ${now.getDate()}.
    ${months[now.getMonth()]}
    ${now.getFullYear()}
`
