const error = document.getElementById('error')
const username = document.getElementById('username')
const portrait = document.getElementById('portrait')
const assigneeBox = document.getElementById('assignee-box')
const loadingBox = document.getElementById('loading-box')

const apiKey = new URLSearchParams(window.location.search).get('key')

const Resources = {
    assigneeTask: new APIResource('8698796zq', 'task'),
}

const data = {
    get: async function (URL) {
        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: apiKey
                }
            })
            if (!response.ok) console.error(response)
            return await response.json()

        } catch (error) {
            console.error(`Error: Failed to fetch data: ${error}`)
        }
    },

    render: async function (RESOURCE) {
        if (apiKey) {
            try {
                const data = await this.get(RESOURCE.URL)

                switch (RESOURCE) {
                    case Resources.assigneeTask:

                        const assignee = data.assignees[0]

                        console.info(assignee)

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
                        break

                    default:
                        console.error('ERROR')
                }

            } catch (error) {
                console.error(`Error: Failed to load data: ${error}`)
                error.classList.add('show-error')
            }
        } else {
            console.error('Error: No key given')
            error.classList.add('show-error')
        }
        loadingBox.classList.remove('show-loading')
    }
}

window.onload = () => data.render(Resources.assigneeTask)


