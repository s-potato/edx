var axios = require('../utils/axios');
var express = require('express');
var variable = require('../variable');
var router = express.Router();

/* GET users listing. */
router.get('/:course_id', function (req, res, next) {
    axios.get("http://192.168.56.101/api/enrollment/v1/enrollments?course_id="+encodeURIComponent(req.params.course_id), {
        headers: {
            Authorization: 'Bearer ' + variable.BEARER.access_token,
        },
    })
        .then((response) => {
            var next, previous;
            if (response.data.next) {
                next = String(response.data.next).split('?')[1];
            }
            if (response.data.previous) {
                previous = String(response.data.previous).split('?')[1];
            }
            let users = [];
            let promises = [];
            for (i = 0; i < response.data.results.length; i++) {
                promises.push(
                    axios.get('http://192.168.56.101/api/user/v1/accounts', {
                        params: {
                            username: response.data.results[i].user
                        }, 
                        headers: {
                            Authorization: 'Bearer ' + variable.BEARER.access_token,
                        },
                    }).then(response => {
                        users.push(response.data[0]);
                    })
                )
            }
            Promise.all(promises).then(() => {
                res.render('courses/list', { users: users, next: next, previous: previous });
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

router.get('/:course_id/:page', function (req, res, next) {
    let params = {
        course_id: req.params.course_id
    }
    console.log(params)
    axios.get("http://192.168.56.101/api/enrollment/v1/enrollments?course_id="+encodeURIComponent(req.params.course_id)+"&"+req.params.page, {
        headers: {
            Authorization: 'Bearer ' + variable.BEARER.access_token,
        },
    })
        .then((response) => {
            var next, previous;
            if (response.data.next) {
                next = String(response.data.next).split('?')[1];
            }
            if (response.data.previous) {
                previous = String(response.data.previous).split('?')[1];
            }
            let users = [];
            let promises = [];
            for (i = 0; i < response.data.results.length; i++) {
                promises.push(
                    axios.get('http://192.168.56.101/api/user/v1/accounts', {
                        params: {
                            username: response.data.results[i].user
                        }, 
                        headers: {
                            Authorization: 'Bearer ' + variable.BEARER.access_token,
                        },
                    }).then(response => {
                        users.push(response.data[0]);
                    })
                )
            }
            Promise.all(promises).then(() => {
                res.render('courses/list', { users: users, next: next, previous: previous });
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

module.exports = router;
