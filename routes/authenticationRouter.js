const router = require('express').Router();
const authenticationController = require('../controllers/authenticationController');
const { body, query } = require('express-validator');


const signupValidator = [
    body('email', 'Invalid email').trim().toLowerCase().isEmail(),
    body('mobile', 'Invalid mobile').trim().notEmpty(),
    body('password', 'Invalid password').trim().isLength({ min: 8, max: 20 }),
    body('fullname', 'Invalid name').trim().notEmpty(),
    body('gender', 'Invalid gender').trim().isIn(["MALE", "FEMALE"]),
    body('address', 'Invalid address').trim().notEmpty()
];


const signinValidator = [
    body('email', 'Invalid email').trim().toLowerCase().isEmail(),
    body('password', 'Invalid password').trim().isLength({ min: 8, max: 20 })
];

router.post('/signup/admin', authenticationController.signupAdmin);

router.post('/signup/user', signupValidator, authenticationController.signupUser);

router.post('/signin', signinValidator, authenticationController.signin);







module.exports = router;