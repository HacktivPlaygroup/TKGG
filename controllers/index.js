const {User, Profile} = require('../models');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');

class Controller{
    static homePage(req, res) {
        const {info} = req.query;
        res.render('HomePage', {info});
    }

    static getLoginPage(req, res) {
        const {info} = req.query;
        res.render('LoginPage', {info});
    }
    static postLoginPage(req, res) {
        let info;
        const {userName, password} = req.body;
        User.findOne({where: {userName} })
        .then(user => {
            if  (user) {
                const isValidPasswrd = bcrypt.compareSync(password, user.password)
                if (isValidPasswrd) {
                    info = `Login ${user.userName} Suskses`;
                    res.redirect(`/?info=${info}`);
                } else {
                    info = "password salah";
                    res.redirect(`/login?info=${info}`)
                }
            } else {
                info = "username salah/tidak ditemukan";
                res.redirect(`/login?info=${info}`)
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
            let info = `Signup ${user.userName} Sukses`;
            res.redirect(`/?info=${info}`)
        })
        .catch(err => res.send(err));
        
    }

}

module.exports = Controller;