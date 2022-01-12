const adminService = require('../services/adminService');
const { validationResult } = require('express-validator');
const responseBody = require('../utils/responseBody');
const ErrorBody = require('../utils/ErrorBody');
const mongoose = require('mongoose');
const { sendEmail } = require('../services/emailService');





exports.getAllUsers = async (req, res, next) => {
    try {
        let result = await adminService.getAllUsers({}, null, { lean: true });
        let response = new responseBody("Users successfully fetched", false, { records: result });
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}



exports.getUser = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        let userId = mongoose.Types.ObjectId(req.query.id);
        let result = await adminService.getUser({ _id: userId }, null, { lean: true });
        let response = new responseBody("Users successfully fetched", false, { record: result });
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}



exports.updateUserPayment = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        let userId = mongoose.Types.ObjectId(req.body.id);
        delete req.body.id;
        await adminService.appendPayment(userId, req.body);
        let response = new responseBody("User payment successfully added", false, {});
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}


exports.updateUserStatus = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        let userId = mongoose.Types.ObjectId(req.body.id);
        delete req.body.id;
        await adminService.updateUser(userId, req.body);
        let response = new responseBody("User status successfully updated", false, {});
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}



exports.sendDueReminder = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        let emailList = req.body.emailList || [];
        let from = process.env.SENDERGRID_EMAIL;
        let subject = "Renewal Reminder";
        let body = `
        <!DOCTYPE html>
        <html>
        <head>
        <title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
        </head>
        <body>
        Dear user, <br>
        your membership is about to expire. Please renew as early as possible.
        <br>
        Regards,
        Membership Management
        </body>
        </html>   
        `;
        await Promise.all(emailList.map(async (email) => {
            try {
                await sendEmail(from, email, subject, body);
                return true;
            } catch (error) {
                return false;
            }
        }));
        let response = new responseBody("Reminder send successfully", false, {});
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}


