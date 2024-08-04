
export default class Notification {
    constructor() {
        this.notification = document.querySelector('.notification')
    }
    show(text, style) {
        this.notification.textContent = text
        if (style) {
            this.notification.classList.add(style)
        }
        this.notification.classList.add('show')
        setTimeout(() => {
            this.notification.classList.remove('show')
            this.notification.classList.remove(style)
        }, 3000)
    }
}