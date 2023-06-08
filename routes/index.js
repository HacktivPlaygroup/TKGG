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
    .post('/login', Controller.postLoginPage)
    .get('/signup', Controller.getSignUpPage)
    .post('/signup', Controller.postSignUpPage)


module.exports = router