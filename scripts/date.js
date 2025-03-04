const date = document.getElementById('date')
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

if (showDate) {
    date.textContent = `
    ${weekdays[now.getDay() - 1]},
    ${now.getDate()}.
    ${months[now.getMonth()]}
    ${now.getFullYear()}`
}
