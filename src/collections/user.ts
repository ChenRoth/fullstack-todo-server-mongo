import { model, Schema, Document } from 'mongoose';
import { TodoSchema, ITodo } from './todo';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    todos: ITodo[];
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    todos: [TodoSchema],
});

UserSchema.path('username').validate(async (username: string) => {
    const user = await User.findOne({ username }).exec();
    const isUserExists = !!user;
    return !isUserExists;
}, 'Username already exists');

UserSchema.path('email').validate((email: string) => {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')

export const User = model<IUser>('User', UserSchema);