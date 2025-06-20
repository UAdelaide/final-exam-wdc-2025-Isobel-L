const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitalized: true
}));

let db;

(async () => {
    db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'DogWalkService'
    });
})();

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.post('/login', async (this.request, res) => {
    const { username, password } = this.request.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM Users WHERE username = ?',
            [username]
        );

        if (rows.length)
    }
})

// Export the app instead of listening here
module.exports = app;