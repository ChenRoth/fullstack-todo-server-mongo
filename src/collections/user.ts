import { model, Schema, Document, Model } from 'mongoose';
import { TodoSchema, ITodo } from './todo';
import { hash, compare } from 'bcrypt';

// this interface just the data of the user
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    todos: ITodo[];
}

// this interface extends the data of the user and adds behavior (functions) to it
export interface IUserModel extends Model<IUser> {
    login(username: string, password: string): Promise<IUser>;
    register(username: string, password: string, email: string): Promise<string>;
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
    return emailRegex.test(email);
}, 'Email must be a valid email address');


// this is the implementation of IUserModel.login
UserSchema.statics.login = async (username: string, password: string): Promise<IUser> => {
    const user = await User.findOne({ username }).select(['_id', 'password']).exec();
    if (!user) {
        throw new Error("username or password don't match");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error("username or password don't match");
    }
    return user;
}

// this is the implementation of IUserModel.register
UserSchema.statics.register = async (username: string, password: string, email: string): Promise<string> => {
    const hashedPassword = await hash(password, 10)
    const user = new User({
        username,
        password: hashedPassword,
        email
    });
    const { _id: userId } = await user.save();
    return userId;
}


export const User = model<IUser, IUserModel>('User', UserSchema);