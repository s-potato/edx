var axios = require('../utils/axios');
var express = require('express');
var variable = require('../variable');
var {tokenMiddle} = require('../utils/token')
var router = express.Router();

/* GET users listing. */
router.get('/:course_id', tokenMiddle, function (req, res, next) {
    axios.get(process.env.EDX+"/api/enrollment/v1/enrollments?course_id="+encodeURIComponent(req.params.course_id), {
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
                if (response.data.results[i].is_active)
                    promises.push(
                        axios.get(process.env.EDX+'/api/user/v1/accounts', {
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
                res.render('courses/list', { course_id: req.params.course_id, users: users, next: next, previous: previous });
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

router.get('/:course_id/:page', tokenMiddle, function (req, res, next) {
    axios.get(process.env.EDX+"/api/enrollment/v1/enrollments?course_id="+encodeURIComponent(req.params.course_id)+"&"+req.params.page, {
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
                if (response.data.results[i].is_active)
                    promises.push(
                        axios.get(process.env.EDX+'/api/user/v1/accounts', {
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
                res.render('courses/list', { course_id: req.params.course_id, users: users, next: next, previous: previous });
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

module.exports = router;
