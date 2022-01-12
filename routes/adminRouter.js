const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { body, query } = require('express-validator');
const { verifyAdmin } = require('../middlewares');



router.get('/user/:token', verifyAdmin, [query('id').trim().notEmpty()], adminController.getUser);

router.get('/users/all/:token', verifyAdmin, adminController.getAllUsers);

router.post('/payment/:token', verifyAdmin, [
    body('from').trim().notEmpty(),
    body('to').trim().notEmpty(),
    body('paymentDate').trim().notEmpty(),
    body('amount').isNumeric(),
    body('id').trim().notEmpty()
], adminController.updateUserPayment);

router.put('/user/:token', verifyAdmin, [
    body('isBlocked').optional({ checkFalsy: true }).isIn([true, false]),
    body('status').optional({ checkFalsy: true }).isIn(["Active", "Deceased", "Lapsed", "Resigned"]),
    body('id').trim().notEmpty()
], adminController.updateUserStatus);


router.post('/email/:token', verifyAdmin, [body('emailList').isArray()], adminController.sendDueReminder);





module.exports = router;