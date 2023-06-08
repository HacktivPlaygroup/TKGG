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
        console.log(req.session);
    }
    
    next();
});  


router.get('/courses', Controller.getCourses)
    .get('/courses/add', Controller.getAddCourse)
    .post('/courses/add', Controller.postAddCourse)
    .get('/profile/:id', Controller.getProfile)
    .post('/profile/:id', Controller.postProfile)
    

module.exports = router