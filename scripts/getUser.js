const box = document.getElementById('box')
const noData = document.getElementById('noData')
const profilePictureElement = document.getElementById('profilePicture')
const usernameElement = document.getElementById('username')

const apiKey = new URLSearchParams(window.location.search).get('key')
const tvURL = 'https://api.clickup.com/api/v2/view/19vq0-51092/task?=#8695efnv4'

const fetchOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey
    }
}

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

                profilePictureElement.src = assignee.profilePicture || 'default-profile.png'
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

window.onload = () => loadData(tvURL)
