const { userModel } = require('../models/userModel');


exports.getAllUsers = async (filters = {}, projection = null, options = {}) => {
    return await userModel.find(filters, projection, options);
}


exports.getUser = async (filters = {}, projection = null, options = {}) => {
    return await userModel.findOne(filters, projection, options);
}

exports.appendPayment = async (id, data = {}) => {
    return await userModel.findByIdAndUpdate(id, { $push: { "payments": data } });
}

exports.updateUser = async (id, updateQuery = {}) => {
    return await userModel.findByIdAndUpdate(id, updateQuery);
}

