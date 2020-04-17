
import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcrypt';

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

userSchema.method('checkPassword', function( password: string  = ''): boolean {

    if ( bcrypt.compareSync( password, this.password )) {
        return true;
    }

    return false;
});


interface IUser extends Document {

    name: string; // string minusucla porque es propio de typescript 
    email: string;
    password: string;
    avatar: string;

    checkPassword( password: string): boolean;

}

export const User = model<IUser>('User', userSchema);
