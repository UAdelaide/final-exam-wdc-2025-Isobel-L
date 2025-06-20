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
            Join Users ON Dogs.owner_id = Users.id;
        `);
        res.json(rows);
        } catch (error) {
         res.status(500).json({ error: 'Failed to fetch dogs :(' });
        }
        });



