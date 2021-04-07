const keys = require('./keys.js');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { Pool } = require('pg');

const pool = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase
});

console.log('connecting');
pool.connect((err, client, release) => {
    if (err) {
        console.error(err);
    }
    console.log('creating table');
    client
        .query('CREATE TABLE IF NOT EXISTS indexed_values (number INT)')
        .then(result => console.log('create table done'))
        .catch((err) => console.error(err));
});

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
    res.send('hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pool.query('select * from indexed_values');

    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values/input', async (req, res) => {
    const index = req.body.index;

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pool.query('insert into indexed_values(number) values ($1)', [index]);

    res.send({working: true});
});

app.listen(5000, err => {
    console.log('Listening on :5000');
})
