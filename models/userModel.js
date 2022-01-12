const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const paymentSchema = new Schema({
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    paymentDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
}, { timestamps: true });

const userSchema = new Schema({
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
    gender: {
        type: String,
        required: true,
        default: "MALE",
        enum: ["MALE", "FEMALE"]
    },
    address: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Deceased", "Lapsed", "Resigned"],
        default: "Active"
    },
    payments: {
        type: [paymentSchema],
        required: true,
        default: []
    },
    token: {
        type: String
    }
}, { timestamps: true });


userSchema.methods.setHash = async function (password) {
    try {
        this.hash = await argon2.hash(password);
    } catch (error) {
        return Promise.reject(error);
    }
};

userSchema.methods.verifyHash = async function (password) {
    try {
        return await argon2.verify(this.hash, password);
    } catch (error) {
        return Promise.reject(error);
    }
};

userSchema.methods.setToken = async function () {
    try {
        this.token = jwt.sign({ id: this._id, type: "USER" }, "secret", { expiresIn: '1h' });
    } catch (error) {
        return Promise.reject(error);
    }
};

const userModel = mongoose.model('users', userSchema);


module.exports = {
    userModel
}