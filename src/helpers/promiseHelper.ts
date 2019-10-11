// @Service()
// class PromiseHelper {
//   constructor() {}
// }


export const fetchPromise = (url) => {
    return new Promise(function(resolve, reject) {
      fetch(url)
        .then((res) => resolve(res.json()))
        .catch(() => {console.error(`Timeout del server ${url}`)})
    });
  }


export const timerPromise = (time) => {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, time, null);
    });
}