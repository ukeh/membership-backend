const router = require('express').Router();
const responseBody = require('../utils/responseBody');




router.get('/', async (req, res, next) => {
    try {
        let response = new responseBody("Success");
        res.status(200);
        res.setHeader("Content-Type", 'application/json');
        res.json(response);
    } catch (error) {
        next({});
    }
});



module.exports = router;