import {sql} from './db';

export async function getTodos(userId: number) {
    const [todos] = await sql.execute('SELECT * FROM todos WHERE userId = ?', [userId]);
    return todos;
}

export async function createTodo(userId: number, description: string, dueDate: Date): Promise<number> {
    const [{insertId: todoId}] = await sql.execute('INSERT INTO todos (userId, description, dueDate) VALUES (?, ?, ?)', [userId, description, dueDate]);
    return todoId;
}

export async function deleteTodo(todoId: number, userId: number): Promise<boolean> {
    const [result] = await sql.execute('DELETE FROM todos WHERE id = ? AND userId = ?', [todoId, userId]);
    return result.affectedRows > 0;
}

export async function toggleComplete(todoId: number, userId: number): Promise<boolean> {
    const [result] = await sql.execute('UPDATE todos SET complete = NOT complete WHERE id = ? AND userId = ?', [todoId, userId]);
    return result.affectedRows > 0;
}