const express = require('express');
const mysql = require('mysq;2/promise');

const app = express();
const PORT = 8080;

let db;





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
app.get('/api/walkers/summary,', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
            u.username as walker_username,
            COUNT(r.rating) AS total_ratings,
            ROUND(AVG(r.rating), 1) AS average_rating,
            COUNT(DISTINCT r.walk_request_id) AS completed_walks
            FROM Users u
            LEFT Join Ratings r ON u.id = r.walker_id
            WHERE u.role = 'walker'
            GROUP BY u.id;
            `);
            res.json(rows);
        } catch (error){
            res.status(500.json({ error: 'Failed to fetch walker summary :('})

