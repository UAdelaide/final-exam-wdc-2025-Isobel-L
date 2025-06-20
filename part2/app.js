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
    saveUninitialized: true
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

        if (rows.length ===0){
            return res.status(401).json({error: "Invalid username or password :("});
        }

        const user = rows[0];
        if (password !== user.password_hash){
            return res.status(401).json({ error: 'Invalid username or password :('})
        }

        req.session.userId = user.user_id;
        req.session.role = user.role;

        res.json({message: 'Login successful :)', role: user.role });
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error'});
        }
}});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'logged out'});
    });
});

// Export the app instead of listening here
module.exports = app;