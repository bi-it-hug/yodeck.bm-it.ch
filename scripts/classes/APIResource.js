class APIResource {
    constructor(id, type) {
        this.id = id
        this.type = type
    }

    get URL() { return `https://api.clickup.com/api/v2/${this.type}/${this.id}` }
}
