const {User, Profile} = require('../models');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');
let info = {};

class Controller{
    static homePage(req, res) {
        info = {};
        res.render('HomePage', {info});
    }

    static getLoginPage(req, res) {
        info = {};
        res.render('LoginPage', {info});
    }
    static postLoginPage(req, res) {
        info = {};
        const {userName, password} = req.body;
        User.findOne({where: {userName} })
        .then(user => {
            if  (user) {
                const isValidPasswrd = bcrypt.compareSync(password, user.password)
                if (isValidPasswrd) {
                    info = {name: `Login ${user.userName} Suskses`};
                    res.render('HomePage', {info});
                } else {
                    info = {name: "password salah"};
                    res.render('LoginPage', {info})
                }
            } else {
                info = {name: "username salah/tidak ditemukan"};
                res.render('LoginPage', {info})
            }
        })
        .catch(err => res.send(err));
    }
    static getSignUpPage(req, res) {
        res.render('SignUpPage');
    }
    static postSignUpPage(req, res) {
        const {userName, password, email, role} = req.body;
        
        User.create({userName, password, email, role})
        .then((user) => {
            info = {name: `Signup ${user.userName} Sukses`};
            res.render('HomePage', {info})
        })
        .catch(err => res.send(err));
        
    }

}

module.exports = Controller;