class responseBody {
    constructor(message = "", isError = false, data = {}) {
        this.message = message;
        this.isError = isError;
        this.data = data;
    }
}


module.exports = responseBody;