"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    // created: { 
    //     type: Date, 
    //     default: Date.now 
    // },
    message: {
        type: String
    },
    imgs: [{
            type: String
        }],
    coords: {
        type: String // -12.033030, 14.233451
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A reference to a user must exist']
    }
});
// Trigger before record the data in the Db.
postSchema.pre('save', function () {
    this.created = new Date();
    next(); // continue de inserction.
});
exports.Post = mongoose_1.model('Post', postSchema);
