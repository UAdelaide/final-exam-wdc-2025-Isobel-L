const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 8080;

let db;

//mysql

async function initDB(){
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'dogwalks'
        });

    console.log('connected to mysql');
    }}

// sample code

INSERT IGNORE INTO Users (username, email, password_hash, role)
VALUES
    ('alice123', 'alice@example.com', 'hashed123', owner)
    ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
    ('carol123', 'carol@example.com', 'hashed789', 'owner'),
    ('isobel124', 'isobel@example.com', 'hashed111', 'owner'),
    ('luffywalker,', 'luffy@example.com', 'hashed222', 'walker');

INSERT IGNORE INTO Dogs (name, size, owner_id)
VALUES
    ('Max','medium', (SELECT id FROM Users WHERE username = 'alice123')),
    ('Bella', 'small',(SELECT id FROM Users WHERE username = 'carol123'));

INSERT IGNORE INTO WalkRequests (dog_id, date_time, duration_minutes, location, status)
VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands','open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),

INSERT IGNORE INTO 


// route: /api/dogs
app.get('/api/dogs', async (req, res) => {
    try {
        const[rows] = await db.query(`
            SELECT
            Dogs.name AS dog_name,
            Dogs.size,
            Users.username AS owner_username
            FROM Dogs
            Join Users ON Dogs.owner_id = Users.id
        `);
        res.json(rows);
        } catch (error) {
         res.status(500).json({ error: 'Failed to fetch dogs :(' });
        }
        });

// route: /api/walkrequests/open
app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const[rows] = await db.query(`
            SELECT
            WalkRequests.id AS request_id,
            Dogs.name AS dog_name,
            WalkRequests.date_time AS requested_time,
            WalkRequests.duration_minutes,
            WalkRequests.location,
            Users.username AS owner_username
        FROM WalkRequests
        JOIN Dogs ON WalkRequests.dog_id = Dogs.id
        JOIN Users ON Dogs.owner_id = Users.id
        WHERE WalkRequests.status = 'open'
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch open walk requests :('});
    }
    });

// route: /api/walkers/summary
app.get('/api/walkers/summary', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
            u.username as walker_username,
            COUNT(r.rating) AS total_ratings,
            ROUND(AVG(r.rating), 1) AS average_rating,
            COUNT(DISTINCT r.walk_request_id) AS completed_walks
            FROM Users u
            LEFT JOIN Ratings r ON u.id = r.walker_id
            WHERE u.role = 'walker'
            GROUP BY u.id
            `);
            res.json(rows);
        } catch (error){
            res.status(500).json({ error: 'Failed to fetch walker summary :('});
        }});

initDB().then(() => {
    app.listen(PORT, () =>{
        console.log(`sever is running at localhost:${PORT} :)`);
    });
});
