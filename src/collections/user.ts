import { model, Schema, Document, Model, Types } from 'mongoose';
import { TodoSchema, ITodo, Todo } from './todo';
import { hash, compare } from 'bcrypt';

// this interface represents a single user instance
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    todos: ITodo[];
    createTodo(details: Pick<ITodo, 'description' | 'date'>): Promise<ITodo>;
    toggleTodo(todoId: string): Promise<void>;
    deleteTodo(todoId: string): Promise<void>;
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


// this interface represents the whole collection - login and register are operations done on the collection, before we have a specific user
export interface IUserModel extends Model<IUser> {
    login(username: string, password: string): Promise<IUser>;
    register(username: string, password: string, email: string): Promise<string>;
}

// we use UserSchema.statics to implement IUserModel ----------

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

//  --------------------------

// we use UserSchema.methods to implement IUser behavior (methods) -----------

// the createTodo method is specific to a user, so we use UserSchema.methods NOT UserSchema.statics
UserSchema.methods.createTodo = async function ({ date, description }): Promise<ITodo> {
    const todo = new Todo({ date, description });
    this.todos.push(todo);
    //  we don't want to validate any existing fields, such as the username etc, 
    // so we pass `validateModifiedOnly: true` to only validate what's changed (the todos array)
    await this.save({ validateModifiedOnly: true });
    return this.todos[this.todos.length - 1];
}

UserSchema.methods.toggleTodo = async function (todoId: string): Promise<void> {
    // we look for the specific todo by comparing the todoId (but remember it's an ObjectID, so we have to use Types.ObjectId wrapper)
    const index = this.todos.findIndex(t => Types.ObjectId(todoId).equals(t._id));
    if (index === -1) {
        throw new Error("todo doesn't exist");
    }
    // if we found the todo, we update its isComplete field
    this.todos[index].isComplete = !this.todos[index].isComplete;
    // and save the document
    await this.save({ validateModifiedOnly: true });
}


UserSchema.methods.deleteTodo = async function (todoId: string): Promise<void> {
    // we look for the specific todo by comparing the todoId (but remember it's an ObjectID, so we have to use Types.ObjectId wrapper)
    const index = this.todos.findIndex(t => Types.ObjectId(todoId).equals(t._id));
    if (index === -1) {
        throw new Error("todo doesn't exist");
    }
    // if we found this todo, we splice it out
    this.todos.splice(index, 1);
    //  and then save the modified document
    await this.save({ validateModifiedOnly: true });
}

//  ------------------------

export const User = model<IUser, IUserModel>('User', UserSchema);