const express = require('express');
const mysql = require('mysq;2/promise');

const app = express();
const PORT = 8080;

let db;





// route: /api/dogs
app.get('/api/dogs', async (req, res) => {
    try {
        const[rows] = await db.query()(`
            SELECT
            Dogs.name AS dog_name,
            



