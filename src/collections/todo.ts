import { model, Schema, SchemaTypes, Document } from 'mongoose';

export interface ITodo extends Document {
    date: Date;
    description: string;
    isComplete?: boolean;
}

export const TodoSchema = new Schema<ITodo>({
    date: Date,
    description: String,
    isComplete: { type: Boolean, default: false }
});


export const Todo = model<ITodo>('Todo', TodoSchema);