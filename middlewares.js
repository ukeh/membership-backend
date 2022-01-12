const jwt = require('jsonwebtoken');
const ErrorBody = require('./utils/ErrorBody');
const { adminModel } = require('./models/adminModel');



exports.verifyAdmin = async (req, res, next) => {
    try {
        let token = req.params.token;
        let decoded;
        try {
            decoded = jwt.verify(token, 'secret', { ignoreExpiration: true });
        } catch (error) {
            throw new ErrorBody(401, "Unauthorized", []);
        }
        if (decoded.type !== "ADMIN") {
            throw new ErrorBody(401, "Unauthorized", []);
        }
        let admin = await adminModel.findOne({ _id: decoded.id, token: token, isBlocked: false });
        if (!admin) {
            throw new ErrorBody(401, "Unauthorized", []);
        }
        next();
    } catch (error) {
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}