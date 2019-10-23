// @Service()
// class PromiseHelper {
//   constructor() {}
// }


export const fetchPromise = (url, params = {}) => {
    return new Promise(function(resolve, reject) {
      fetch(url, params)
        .then((res) => resolve(res.json()))
        .catch(() => {console.error(`Timeout del server ${url}`)})
    });
  }


export const timerPromise = (time) => {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, time, null);
    });
}