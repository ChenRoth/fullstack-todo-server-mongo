import { Router } from 'express';
import { getTodos, createTodo, deleteTodo, toggleComplete } from '../db/todosQueries';
import { User } from '../collections';
import { TodoSchema, Todo } from '../collections/todo';

export const todosRouter = Router();

todosRouter.get('/', async (req, res) => {
    const { userId } = (req as any).user;
    const user = await User.findOne({ _id: userId }).select('todos');
    res.send(user!.todos);
});

todosRouter.post('/', async (req, res) => {
    const { userId } = (req as any).user;
    const { description, date } = req.body;
    const todo = new Todo({ description, date });
    const user = await User.findByIdAndUpdate(userId, { $push: { todos: todo } }, { new: true }).select('todos').exec();
    const todoFromDb = user!.todos[user!.todos.length - 1];
    res.send({ todo: todoFromDb });
});

todosRouter.delete('/:todoId', async (req, res) => {
    const { userId } = (req as any).user;
    const { todoId } = req.params;
    const isDeleted = await User.updateOne({ _id: userId }, { $pull: { todos: { _id: todoId } } });

    if (isDeleted.ok === 1) {
        res.send('ok');
    } else {
        res.status(404).send("todo doesn't exist");
    }
});

todosRouter.put('/:todoId/toggle', async (req, res) => {
    const { userId } = (req as any).user;
    const { todoId } = req.params;
    const todoIdNum = Number(todoId);
    if (isNaN(todoIdNum)) {
        return res.send(400).send('id must be a number!');
    }
    const isSuccess = await toggleComplete(todoIdNum, userId);
    if (isSuccess) {
        res.send('ok');
    } else {
        res.status(404).send("todo doesn't exist");
    }
});