var axios = require('axios')
const instance = axios.create({
    withCredentials: true,
    xsrfHeaderName: 'X-CSRFToken',
    xsrfCookieName: 'csrftoken',
})

module.exports = instance