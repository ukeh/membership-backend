const { userModel } = require('../models/userModel');
const { adminModel } = require('../models/adminModel');

exports.createUser = async (reqBody = {}) => {
    try {
        let userRecord = new userModel(reqBody);
        await userRecord.setHash(reqBody.password);
        return await userRecord.save();
    } catch (error) {
        return Promise.reject(error);
    }
}


exports.createAdmin = async (reqBody = {}) => {
    try {
        let adminRecord = new adminModel(reqBody);
        await adminRecord.setHash(reqBody.password);
        return await adminRecord.save();
    } catch (error) {
        return Promise.reject(error);
    }
}


exports.findUserWithFilters = async (filters = {}, projection = null, options = {}) => {
    return await userModel.findOne(filters, projection, options);
}

exports.findAdminwithFilters = async (filters = {}, projection = null, options = {}) => {
    return await adminModel.findOne(filters, projection, options);
}