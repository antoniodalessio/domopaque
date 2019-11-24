"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleHome = require('node-googlehome');
class GoogleHomeController {
    constructor() {
        this.device = null;
        this.ready = false;
        this.defaultLang = 'it';
        this.device = new GoogleHome.Connecter('192.168.1.7');
        this.device.config({ lang: this.defaultLang });
        this.device.readySpeaker()
            .then(() => {
            this.ready = true;
        });
    }
    speak(msg, lang = null) {
        if (lang) {
            this.device.config({ lang });
        }
        this.device.speak(msg);
    }
}
exports.default = GoogleHomeController;
//# sourceMappingURL=GoogleHome.controller.js.map