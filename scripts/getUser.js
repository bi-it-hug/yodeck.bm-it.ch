const assigneeBox = document.getElementById('assignee-box')
const noData = document.getElementById('no-data')
const username = document.getElementById('username')
const loading = document.getElementById('loading')
const taskURL = 'https://api.clickup.com/api/v2/view/19vq0-51092/task?=#8695efnv4'
const apiKey = new URLSearchParams(window.location.search).get('key')
const cutAbbreviation = true
const fetchOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey
    }
}

window.data = {
    get: async function (URL) {
        try {
            const response = await fetch(URL, fetchOptions)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            return await response.json()

        } catch (error) {
            console.error(`Failed to fetch data: ${error}`)
        }
    },

    render: async function (URL) {
        if (apiKey) {
            try {
                const data = await this.get(URL)
                const assignee = data.tasks[0].assignees[0]

                let circleFill

                if (assignee.profilePicture === null) {
                    circleFill = document.createElement('h1')
                    circleFill.textContent = assignee.initials

                } else {
                    circleFill = document.createElement('img')
                    circleFill.src = assignee.profilePicture
                }

                if (cutAbbreviation) {
                    username.textContent = assignee.username.replace(/\s*\(.*?\)/, '')

                } else {
                    username.textContent = assignee.username
                }

                circleFill.id = 'circle-fill'
                assigneeBox.append(circleFill)
                assigneeBox.classList.add('show')

            } catch (error) {
                console.error(`Failed to load data: ${error}`)
                noData.classList.add('show')
            }
        } else {
            console.error('No key was given')
            noData.classList.add('show')
        }
        loading.classList.remove('show')
    }
}

window.onload = () => data.render(taskURL)
