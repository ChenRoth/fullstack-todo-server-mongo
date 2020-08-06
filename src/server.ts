import express from 'express';
import cors from 'cors';
import expressJwt from 'express-jwt';
import { usersRouter } from './routers/usersRouter';
import { todosRouter } from './routers/todosRouter';
import { connectDb } from './db/db';

const PORT = 4000;

const { JWT_SECRET = 'secret' } = process.env;

const app = express();

app.use(express.json());
app.use(cors());
// require JWT for all routes other than /users/*
app.use(expressJwt({ secret: JWT_SECRET }).unless({ path: ['/users/register', '/users/login'] }));

app.get('/', (req, res) => {
    res.send('Hi there!');
})

app.use('/todos', todosRouter);
app.use('/users', usersRouter);

startServer();

async function startServer() {
    await connectDb();
    app.listen(PORT, () => console.log(`Server is up at ${PORT}`));
}