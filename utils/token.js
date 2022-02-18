var axios = require('axios')
var variable = require('../variable')

exports.token = function (cb) {
    if (variable.BEARER && variable.BEARER.expires_in > Date.now()) {
        return cb();
    }
    var params = {
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        token_type: "jwt"
    }
    axios({ method: 'post', url: "http://192.168.56.101/oauth2/access_token", params: params })
        .then((response) => {
            variable.BEARER = response.data;
            variable.BEARER.expires_in = Date.now() + response.data.expires_in*1000;
            console.log(variable);
            cb();
        })
        .catch(err => {
            console.log(err);
        })
}