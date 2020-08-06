import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../collections';

const { JWT_SECRET = 'secret' } = process.env;

const usersRouter = Router();

usersRouter.get('/ping', async (req, res) => {
    const { userId } = (req as any).user;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).end();
    }
    res.send({username: user.username});
});

usersRouter.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const userId = await User.register(username, password, email);
        const token = jwt.sign({ userId }, JWT_SECRET);
        res.send({ token });
    } catch (e) {
        res.status(403).send(e.message);
    }
});

usersRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
    const user = await User.login(username, password);
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send({ token });
    } catch (e) {
        res.status(401).send(e.message);
    }
});


export { usersRouter };

