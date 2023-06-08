const express = require('express')
const Controller = require('../controllers')
const router = express.Router()

// middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
//   next()
// })

// define the home page route
router.get('/', Controller.homePage)
    .get('/login', Controller.getLoginPage)
    .get('/signup', Controller.getSignUpPage)
    .post('/signup', Controller.postSignUpPage)
    .post('/login', Controller.postLoginPage);

router.use(function (req, res, next) {
    if(!req.session.user){
        res.redirect('/login?info=LOGIN DULU NATHAN')
    }
    console.log(req.session);
    next();
});  

const isAdmin = function (req, res, next) {
    if (req.session.user.role !== 'Teacher') {
        res.redirect('/courses/?info=You have no access!')
    }
    next();
}

router.get('/courses', Controller.getCourses)
    .get('/courses/add', isAdmin, Controller.getAddCourse)
    .post('/courses/add', Controller.postAddCourse)
    .get('/courses/edit/:id', isAdmin, Controller.getEditCourse)
    .post('/courses/edit/:id', Controller.postEditCourse)
    .get('/profile/:id', Controller.getProfile)
    .post('/profile/:id', Controller.postProfile)
    .get('/courses/student/:id', Controller.getStudentDetail)
    .get('/courses/delete/:id', isAdmin, Controller.getDeleteCourse)
    .get('/courses/student/:id', Controller.getStudentCourse)
    .get('/courses/enroll/:id', Controller.getEnrollBtn)
    .get('/logout', Controller.getOut)


module.exports = router