
import { Schema, model, Document } from "mongoose";

const postSchema = new Schema( {

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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'A reference to a user must exist']
    }

});

// Trigger before record the data in the Db.
postSchema.pre<IPost>('save', function() {
    this.created = new Date();
    next(); // continue de inserction.
});

interface IPost extends Document {
    created: Date;
    message: string;
    imgs: string[];
    coords: string;
    user: string;

}

export const Post = model<IPost>('Post', postSchema);