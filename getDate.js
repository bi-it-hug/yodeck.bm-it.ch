const dateElement = document.getElementById('dateElement')
const now = new Date()
dateElement.textContent = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`