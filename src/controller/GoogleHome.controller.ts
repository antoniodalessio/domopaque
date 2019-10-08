const GoogleHome = require('node-googlehome')


export default class GoogleHomeController {
    
    device = null
    ready = false
    defaultLang = 'it'

    constructor() {
        this.device = new GoogleHome.Connecter('192.168.1.7')
        this.device.config({lang: this.defaultLang})
        this.device.readySpeaker()
            .then(() => {
                this.ready = true
            })
    }

    speak(msg, lang = null) {
        if (lang) {
            this.device.config({lang})
        }
        this.device.speak(msg)
    }
}