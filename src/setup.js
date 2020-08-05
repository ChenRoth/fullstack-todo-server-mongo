db.users.insertMany([
    {
        username: 'a',
        password: 'a',
        todos: [
            {
                id: uuid,
                description: '',
                date: '',
                isComplete: false
            }
        ]
    }
])