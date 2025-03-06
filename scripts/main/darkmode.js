const darkMode = {
    className: 'dark-mode',
    isActive: document.body.classList.contains(this.className),
    clickUpLogo: {
        element: document.getElementById('click-up-logo'),
        path: './assets/images/',
    },

    apply: function () {
        document.body.classList.toggle(this.className, this.isActive)

        if (this.isActive) {
            this.clickUpLogo.element.src = `${this.clickUpLogo.path}logo-v3-clickup-dark.svg`

        } else {
            this.clickUpLogo.element.src = `${this.clickUpLogo.path}logo-v3-clickup-light.svg`
        }
    },

    toggle: function () {
        this.isApplied = !this.isActive
        this.apply()
        localStorage.setItem(this.className, this.isActive ? 'true' : 'false')
        return this.isActive
    },

    fetch: function () {
        this.isApplied = localStorage.getItem(this.className) === 'true'
        this.apply()
        return this.isActive
    }
}

darkMode.fetch()
