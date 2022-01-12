const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const argon2 = require('argon2');
const ErrorBody = require('../utils/ErrorBody');
const jwt = require('jsonwebtoken');

const adminSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    hash: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    token: {
        type: String
    }
}, { timestamps: true });



adminSchema.methods.setHash = async function (password) {
    try {
        this.hash = await argon2.hash(password);
    } catch (error) {
        return Promise.reject(error);
    }
}

adminSchema.methods.verifyHash = async function (password) {
    try {
        return await argon2.verify(this.hash, password);
    } catch (error) {
        return Promise.reject(error);
    }
};

adminSchema.methods.setToken = async function () {
    try {
        this.token = jwt.sign({ id: this._id, type: "ADMIN" }, "secret", { expiresIn: '1h' });
    } catch (error) {
        return Promise.reject(error);
    }
};

const adminModel = mongoose.model('admins', adminSchema);


module.exports = {
    adminModel
}