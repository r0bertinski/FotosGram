"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Schema for mongoDb
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'The name is necessary']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is necessary']
    },
    password: {
        type: String,
        required: [true, 'The password is mandatory']
    },
});
// Method added to the user schema.
userSchema.method('checkPassword', function (password = '') {
    // Compare the post password sent by the login attempt, with the Db stored password for this user.
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    return false;
});
exports.User = mongoose_1.model('User', userSchema);
