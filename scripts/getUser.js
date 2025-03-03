const box = document.getElementById('box')
const noData = document.getElementById('no-data')
const profilePictureElement = document.getElementById('circleFill')
const usernameElement = document.getElementById('username')
const taskURL = 'https://api.clickup.com/api/v2/view/19vq0-51092/task?=#8695efnv4'
const apiKey = new URLSearchParams(window.location.search).get('key')

const fetchOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey
    }
}

let circleFill

async function getData(url) {
    try {
        const resp = await fetch(url, fetchOptions)
        if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`)
        return await resp.json()

    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

async function loadData(url) {
    if (apiKey) {
        try {
            const data = await getData(url)

            if (data && data.tasks.length > 0 && data.tasks[0].assignees.length > 0) {
                const assignee = data.tasks[0].assignees[0]

                if (assignee.profilePicture === null) {
                    circleFill = document.createElement('h1')
                    circleFill.textContent = assignee.initials

                } else {
                    circleFill = document.createElement('img')
                    circleFill.src = assignee.profilePicture
                }

                circleFill.id = 'circleFill'
                box.append(circleFill)

                usernameElement.textContent = assignee.username || 'Unknown User'
                box.classList.add('show')

            } else {
                noData.classList.add('show')
            }
        } catch (error) {
            noData.classList.add('show')
        }
    } else {
        noData.classList.add('show')
    }
}

window.onload = () => loadData(taskURL)
