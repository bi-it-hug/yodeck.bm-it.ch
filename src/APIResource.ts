export default class APIResource {
    id: string
    type: string

    constructor(id: string, type: string) {
        this.id = id
        this.type = type
    }

    get URL(): string {
        switch (this.type) {
            case "task":
                return `https://api.clickup.com/api/v2/task/${this.id}`

            case "open-task":
                return `https://api.clickup.com/api/v2/list/${this.id}/task?include_closed=false`

            default:
                return ""
        }
    }
}
