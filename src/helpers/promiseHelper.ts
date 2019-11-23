export const fetchPromise = (url, params = {}, failMsg = 'no failed message') => {
    return new Promise(function(resolve, reject) {
      fetch(url, params)
        .then((res) => resolve(res.json()))
        .catch(() => {console.error(failMsg)})
    });
  }


export const timerPromise = (time) => {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, time, null);
    });
}