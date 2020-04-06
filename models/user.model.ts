
import { Schema, model, Document } from "mongoose";

const userSchema = new Schema( {

    name: {
        type: String,
        required: [ true, 'The name is necessary']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'The email is necessary']
    },
    password: {
        type: String,
        required: [ true, 'The password is mandatory']
    },
});

interface Iuser extends Document {

    name: string; // string minusucla porque es propio de typescript 
    email: string;
    password: string;
    avatar: string;

}

export const User = model('User', userSchema);