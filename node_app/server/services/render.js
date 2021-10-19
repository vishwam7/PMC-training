const axios = require('axios');
const _ = require('lodash');

exports.homeRoutes = (req, res) => {
    axios.get('http://localhost:3000/api/users').then(function(response) {
        let count = _.size(response.data)
        console.log(count);
        res.render('index', { data: { users: response.data, count: count } });
    }).catch(err => {
        res.send(err)
    })
}

exports.renderOne = (req, res) => {
    if (req.params.id) {
        axios.get('http://localhost:3000/api/users', { params: { id: req.params.id } }).then(function(userdata) {
                let count = _.size(userdata.data);
                console.log(count);
                res.render("index", { data: { users: userdata.data, count: count } })
            })
            .catch(err => {
                res.send(err)
            })
    }

}

exports.addUser = (req, res) => {
    res.render('add_user');
}

exports.updateUser = (req, res) => {
    axios.get('http://localhost:3000/api/users', { params: { id: req.query.id } }).then(function(userdata) {
            res.render("update_user", { user: userdata.data })
        })
        .catch(err => {
            res.send(err)
        })
}