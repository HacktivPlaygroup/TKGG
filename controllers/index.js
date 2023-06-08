const {User, Profile, Course, StudentCourse} = require('../models');
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
            if (user) {
                // return res.send(req.session);
                const isValidPasswrd = bcrypt.compareSync(password, user.password)
                if (isValidPasswrd) {
                    req.session.user = { id: user.id, role: user.role, name: user.userName}
                    
                    // console.log(req.session, " <<<controler");
                    // info = `Login ${user.userName} Suskses`;
                    res.redirect(`/courses`);
                } else {
                    info = "password salah";
                    res.redirect(`/login?info=${info}`)
                }
            } else {
                info = "username salah/tidak ditemukan";
                res.redirect(`/login?info=${info}`)
            }
        })
        .catch(err => console.log(err));
    }

    static getSignUpPage(req, res) {
        res.render('SignUpPage');
    }

    static postSignUpPage(req, res) {
        const {userName, password, email, role} = req.body;
        
        User.create({userName, password, email, role})
        .then((user) => {
            Profile.create({UserId: user.id})
            let info = `Signup ${user.userName} Sukses`;
            res.redirect(`/?info=${info}`)
        })
        .catch(err => res.send(err));
    }

    // MAIN DISH
    // MAIN DISH
    // MAIN DISH
    // MAIN DISH
    // MAIN DISH
    static getCourses(req, res) {
        const userInfo = req.session.user;
        Course.findAll({include: User})
        .then( (course) => {
            // res.send(course)
            console.log(req.session);
            res.render('CoursePage', {course, userInfo});
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        });
    }

    static getAddCourse(req, res) {
        let TeacherId = 8;
        User.findOne({where: {id: TeacherId}})
        .then(teacher => {
            // res.send(teacher);
            res.render('CourseAddForm', {teacher, userInfo: req.session.user})
        })
        .catch(err => res.send(err));
        
    }

    static postAddCourse(req, res) {
        // return res.send(req.body)
        Course.create(req.body)
        .then( () => res.redirect('/Courses') )
        .catch(err => res.send(err));
    }

    static getProfile(req, res) {
        // res.send ()
        // console.log(req.params.id)
        const userInfo = req.session.user
        Profile.findOne({
                where: {
                    UserId: req.session.user.id
                }
             })
            .then((user) => {
                res.render('ProfileForm', {user, userInfo})
            })
            .catch(err => res.send(err))
    }

    static postProfile(req, res) {
        const {firstName, lastName, phone, address} = req.body
        Profile.update({firstName, lastName, phone, address}, {where: {
            UserId: req.session.user.id
        }})
            .then(() => {
                res.redirect('/profile/' + req.session.user.id)
            })
            .catch(err => res.send(err))

    }

}

module.exports = Controller;