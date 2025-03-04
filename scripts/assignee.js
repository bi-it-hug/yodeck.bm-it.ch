const assigneeBox = document.getElementById('assignee-box')
const error = document.getElementById('error')
const username = document.getElementById('username')
const portrait = document.getElementById('portrait')
const loadingBox = document.getElementById('loading-box')
const taskURL = 'https://api.clickup.com/api/v2/view/19vq0-51092/task?=#8695efnv4'
const apiKey = new URLSearchParams(window.location.search).get('key')

window.data = {
    get: async function (URL) {
        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: apiKey
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()

        } catch (error) {
            console.error(`Error: Failed to fetch data: ${error}`)
        }
    },

    render: async function (URL) {
        if (apiKey) {
            try {
                const data = await this.get(URL)
                const assignee = data.tasks[0].assignees[0]

                if (assignee.profilePicture === null) {
                    portrait.src = '../assets/images/not-found.svg'

                } else {
                    portrait.src = assignee.profilePicture
                }

                if (cutAbbreviation) {
                    username.textContent = assignee.username.replace(/\s*\(.*?\)/, '')

                } else {
                    username.textContent = assignee.username
                }

                assigneeBox.classList.add('show-assignee')

            } catch (error) {
                console.error(`Error: Failed to load data: ${error}`)
                error.textContent = `Error: Failed to load data: ${error}`
                error.classList.add('show-error')
            }
        } else {
            console.error('Error: No key given')
            error.textContent = 'Error: No key given'
            error.classList.add('show-error')
        }
        // loadingBox.classList.remove('show')
    }
}

window.onload = () => data.render(taskURL)
