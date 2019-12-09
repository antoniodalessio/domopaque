"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPromise = (url, params = {}, failMsg = 'no failed message') => {
    return new Promise(function (resolve, reject) {
        fetch(url, params)
            .then((res) => resolve(res.json()))
            .catch(() => { console.error(failMsg); });
    });
};
exports.timerPromise = (time) => {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, time, null);
    });
};
//# sourceMappingURL=promiseHelper.js.map