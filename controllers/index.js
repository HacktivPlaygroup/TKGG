const {User, Profile, Course, StudentCourse} = require('../models');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const { learnRoll } = require('../helpers/learnG');

class Controller{
    static homePage(req, res) {
        let {info} = req.query;
        if(req.session.user) info = `Kmau login dengan username ${req.session.user.name}`
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
        let {errors} = req.query
        res.render('SignUpPage' , {errors});
    }

    static postSignUpPage(req, res) {
        const {userName, password, email, role} = req.body;
        
        User.create({userName, password, email, role})
        .then((user) => {
            Profile.create({UserId: user.id})
            let info = `Signup ${user.userName} Sukses`;
            res.redirect(`/?info=${info}`)
        })
        .catch(err => {
            if(err.name === "SequelizeValidationError") {
                let errorsMsg = err.errors.map(e => {
                    return e.message
                }).join(' ')
                return res.redirect(`/signup?errors=${errorsMsg}`)
            }
            res.send(err)
        });
    }

    // MAIN DISH
    // MAIN DISH
    // MAIN DISH
    // MAIN DISH
    // MAIN DISH
    static getCourses(req, res) {
        const userInfo = req.session.user;
        let {search} = req.query;
        let course;

        // if(req.params.search) whereStatement.name = `[Op.iLike]`

        Course.findAll({
            include: [User, StudentCourse],
            where: Course.nameSearch(search)
        })
        .then( (courseData) => {
            course = courseData;
            // res.send({course,userInfo})
            // Course.findAll()
            res.render('CoursePage', {course, userInfo});
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        });
    }

    static getAddCourse(req, res) {
        User.findOne({where: {id: req.session.user.id}})
        .then(teacher => {
            // res.send(teacher);
            res.render('CourseAddForm', {teacher, userInfo: req.session.user})
        })
        .catch(err => console.log(err));
    }

    static postAddCourse(req, res) {
        // return res.send(req.body)
        Course.create(req.body)
        .then( () => res.redirect('/Courses') )
        .catch(err => res.send(err));
    }

    static getEditCourse(req, res) {
        Course.findByPk(req.params.id,
            {
                include:User
            })
        .then((courseData) => {
            // res.send(courseData);
            // console.log(courseData.User.userName);
            res.render('CourseEditForm', {courseData, userInfo:req.session.user})
        })
        .catch(err => console.log(err))
    }

    static postEditCourse(req, res) {
        // res.send(req.body);
        Course.update(req.body, {where: {id: req.params.id}})
        .then(() => res.redirect('/courses'))
        .catch(err => console.log(err))
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
    
    static getDeleteCourse(req,res) {
        StudentCourse.destroy({
            cascade: true,
            where: {CourseId: req.params.id}
        })
        .then(() => {
            Course.destroy({where: {id: req.params.id}})
            res.redirect('/courses')
        })
        .catch(err => res.send(err))
    }

    static getDeleteEnrollCourse(req,res) {
        StudentCourse.destroy({
            cascade: true,
            where: {CourseId: req.params.id}
        })
        .then(() => res.redirect(`/courses/student/${req.session.user.id}`))
        .catch(err => res.send(err))
    }

    static getEnrollBtn(req, res) {
        const CourseId = req.params.id;
        const StudentId = req.session.user.id;
        StudentCourse.create({CourseId, StudentId})
        .then(() => res.redirect('/courses'))
        .catch(err => console.log(err));
    }

    static getStudentDetail(req, res) {
        let stdCourse;
        StudentCourse.findAll({
            where: {StudentId: req.params.id},
            include: [User,Course]
        })
        .then((stdDetail) => {
            stdCourse = stdDetail;
            return Profile.findOne({
                where: {UserId: req.params.id},
                include: User
            })
        })
        .then((stdProfile) => {
            console.log(stdProfile);
           res.render('StudentEnrollDetail', {stdCourse,stdProfile, userInfo:req.session.user})

        })
        .catch(err => console.log(err))
    }
    
    static getLearnCourse(req,res) {
        User.findByPk(req.session.user.id)
        .then((user) => {
            // res.send(user);
            const grade = learnRoll(user.grade);
            return User.update({grade},{where:{id: req.session.user.id}})
        })
        .then(() => res.redirect(`/courses/student/${req.session.user.id}`))
        .catch(err => res.send(err))
    }

    static getStudentCourse(req, res) {
        let userProfile;
        Profile.findOne({
            where: {UserId: req.session.user.id},
            include: User
        })
        .then((profileData) => {
            userProfile = profileData;
            StudentCourse.findOne({
                where: {StudentId: profileData.UserId},
                include: Course
            })
            // res.send(userProfile);
        })
        .then((stdCourse) => {
            res.send(stdCourse);
        })
        .catch(err => console.log(err))
    }

    static getOut(req, res) {
        const username = req.session.user.name
        req.session.destroy((err) => {
            if (err) res.send(err)
            else res.redirect(`/login?info=${username} telah logout`)
        })
    }

}

module.exports = Controller;