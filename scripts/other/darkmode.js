const darkMode = {
    className: 'dark-mode',
    isApplied: document.body.classList.contains(this.className),
    clickUpLogo: document.getElementById('click-up-logo'),

    apply: function () {
        document.body.classList.toggle(this.className, this.isApplied)
        this.clickUpLogo.src = this.isApplied ? './assets/images/logo-v3-clickup-dark.svg' : './assets/images/logo-v3-clickup-light.svg'
    },

    toggle: function () {
        this.isApplied = !this.isApplied
        this.apply()
        localStorage.setItem(this.className, this.isApplied ? 'true' : 'false')
        return this.isApplied
    },

    fetch: function () {
        this.isApplied = localStorage.getItem(this.className) === 'true'
        this.apply()
        return this.isApplied
    }
}

darkMode.fetch()
