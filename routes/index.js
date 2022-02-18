var express = require('express');
const { token } = require('../utils/token');
var FormData = require('form-data');
var axios = require('../utils/axios');
var variable = require('../variable');
var {tokenMiddle} = require('../utils/token')
var router = express.Router();

/* GET home page. */
router.get('/', tokenMiddle, function (req, res, next) {
    var username = "staff"
    let params = {
        username: username,
        page_size: 10,
    }
    axios.get(process.env.EDX+'/api/courses/v1/courses', {
        params: params, headers: {
            Authorization: 'Bearer ' + variable.BEARER.access_token,
        },
    })
        .then((response) => {
            var pagination = response.data.pagination;
            if (pagination.next) {
                pagination.next = String(pagination.next).split('?')[1];}
            if (pagination.previous) {
                pagination.previous = String(pagination.previous).split('?')[1];}
            res.render('index', { user: username, courses: response.data.results, pagination:  pagination, domain: process.env.EDX});
        }).catch(err => {
            res.status(500).json(err)
        })
})

router.get('/page/:page', tokenMiddle, function (req, res, next) {
    var username = "staff"
    axios.get(process.env.EDX+"/api/courses/v1/courses?"+ req.params.page, {
        headers: {
            Authorization: 'Bearer ' + variable.BEARER.access_token,
        },
    })
        .then((response) => {
            var pagination = response.data.pagination;
            if (pagination.next) {
                pagination.next = String(pagination.next).split('?')[1];
            }
            if (pagination.previous) {
                pagination.previous = String(pagination.previous).split('?')[1];
            }
            res.render('index', { user: username, courses: response.data.results, pagination:  pagination, domain: process.env.EDX});
        }).catch(err => {
            res.status(500).json(err)
        })
})


module.exports = router;
