import { Router } from 'express';
import { User } from '../collections';
import { Todo } from '../collections/todo';

export const todosRouter = Router();

todosRouter.get('/', async (req, res) => {
    const { userId } = (req as any).user;
    const user = await User.findOne({ _id: userId }).select('todos');
    res.send(user!.todos);
});

todosRouter.post('/', async (req, res) => {
    const { userId } = (req as any).user;
    const { description, date } = req.body;
    const user = await User.findById(userId);
    try {
        const todo = await user?.createTodo(new Todo({ description, date }));
        res.send({ todo });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

todosRouter.delete('/:todoId', async (req, res) => {
    const { userId } = (req as any).user;
    const { todoId } = req.params;
    const user = await User.findById(userId);
    try {
        await user?.deleteTodo(todoId);
        res.send('ok');
    } catch (e) {
        res.status(404).send(e.message);
    }
});

todosRouter.put('/:todoId/toggle', async (req, res) => {
    const { userId } = (req as any).user;
    const { todoId } = req.params;
    const user = await User.findById(userId);
    try {
        await user?.toggleTodo(todoId);
        res.send('ok');
    } catch (e) {
        res.status(404).send(e.message);
    }
});