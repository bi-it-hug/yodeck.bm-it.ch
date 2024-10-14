let data
const imgElement = document.getElementById('userImage')
const usernameElement = document.getElementById('username')
const apiKey = 'pk_44151279_TNFEERET56V3E7MIP60853MMF6BTJUW6'
const taskId = '#8695efnv4'
const url = `https://api.clickup.com/api/v2/view/19vq0-51092/task?=${taskId}`
const fetchOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey
    },
    redirect: 'follow'
}

async function getData() {
    try {
        const resp = await fetch(url, fetchOptions)
        if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`)

        data = await resp.json()
        return data

    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

async function loadData() {
    try {
        data = await getData()

        if (data) {
            const profilePictureUrl = data.tasks[0].assignees[0].profilePicture
            const nameUrl = data.tasks[0].assignees[0].username

            imgElement.src = profilePictureUrl
            usernameElement.textContent = nameUrl
        }
    } catch (error) {
        console.error('Error loading profile picture:', error)
    }
}

window.onload = loadData
