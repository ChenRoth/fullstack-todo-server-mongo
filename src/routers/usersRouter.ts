import { hash, compare } from 'bcrypt';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../collections';

const { JWT_SECRET = 'secret' } = process.env;

const usersRouter = Router();

usersRouter.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await hash(password, 10)
    try {
        const user = new User({
            username,
            password: hashedPassword,
            email
        });
        const { _id: userId } = await user.save();
        const token = jwt.sign({ userId }, JWT_SECRET);
        res.send({ token });
    } catch (e) {
        res.status(403).send(e);
    }
});

usersRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select(['_id', 'password']).exec();
    if (!user) {
        return res.status(401).send("username or password don't match");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).send("username or password don't match");
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send({ token });
});


export { usersRouter };
