module.exports = class AppError extends Error{
    constructor(message) {
        super(message);
        this.flag = true;
    }
}
