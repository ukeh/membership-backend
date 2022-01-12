const router = require('express').Router();
const authenticationService = require('../services/authenticationService');
const { validationResult } = require('express-validator');
const responseBody = require('../utils/responseBody');
const ErrorBody = require('../utils/ErrorBody');



exports.signupUser = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        else {
            let reqBody = req.body;
            const user = await authenticationService.findUserWithFilters({ $or: [{ email: reqBody.email }, { mobile: reqBody.mobile }] }, '_id', { lean: true });
            if (user) {
                let response = new responseBody("User alredy exists", true, {});
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                return res.json(response);
            }
            await authenticationService.createUser(reqBody);
            let response = new responseBody("User successfully registered", false, {});
            res.status(201);
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        console.log(error)
        next([400].includes(error.status) ? error : {});
    }
}



exports.signupAdmin = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        else {
            let reqBody = req.body;
            await authenticationService.createAdmin(reqBody);
            let response = new responseBody("Admin successfully registered", false, {});
            res.status(201);
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next([400].includes(error.status) ? error : {});
    }
}


exports.signin = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        else {
            let reqBody = req.body;
            let user;
            let type = 'USER';
            let records = await Promise.all([
                authenticationService.findAdminwithFilters({ email: reqBody.email, isBlocked: false }),
                authenticationService.findUserWithFilters({ email: reqBody.email, isBlocked: false })
            ]);
            if (records[0]) {
                user = records[0];
                type = 'ADMIN';
            }
            else if (records[1]) {
                user = records[1];
                type = 'USER';
            }
            else {
                let response = new responseBody("invalid account", true, {});
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                return res.json(response);
            }
            if (!await user.verifyHash(reqBody.password)) {
                let response = new responseBody("invalid password", true, {});
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                return res.json(response);
            } else {
                await user.setToken();
                await user.save();
                let response = new responseBody("Login successful", false, { token: user.token, fullname: user.fullname, email: user.email, mobile: user.mobile, type: type, status: user.status || "" });
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }
        }
    } catch (error) {
        next([400].includes(error.status) ? error : {});
    }
}