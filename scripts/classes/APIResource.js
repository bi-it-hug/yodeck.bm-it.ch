class APIResource {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }

    get URL() {
        switch (this.type) {
            case "task":
                return `https://api.clickup.com/api/v2/task/${this.id}`;

            case "task-list":
                return `https://api.clickup.com/api/v2/list/${this.id}/task`;

            default:
                return `https://api.clickup.com/api/v2/${this.type}/${this.id}`;
        }
    }
}
