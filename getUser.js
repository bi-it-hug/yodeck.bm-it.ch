async function getData() {
    try {
        const resp = await fetch(
            'https://api.clickup.com/api/v2/view/19vq0-51092/task?=#8695efnv4',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'pk_44151279_TNFEERET56V3E7MIP60853MMF6BTJUW6'
                },
                redirect: 'follow'
            }
        )

        if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`)
        const data = await resp.json()
        return data

    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

async function loadProfilePicture() {
    try {
        const data = await getData()

        if (data) {
            const profilePictureUrl = data.tasks[0].assignees[0].profilePicture
            const nameUrl = data.tasks[0].assignees[0].username

            const imgElement = document.getElementById('profileImage')
            const usernameElement = document.getElementById('username')
            imgElement.src = profilePictureUrl
            usernameElement.textContent = nameUrl

        }
    } catch (error) {
        console.error('Error loading profile picture:', error)
    }
}

window.onload = loadProfilePicture
