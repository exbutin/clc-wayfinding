require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const databaseRoutes = require('./routes/database');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Use the database routes
app.use('/api/database', databaseRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const username = encodeURIComponent('lolfert');
const password = encodeURIComponent('N6t8XHYYs@Ks');
const cluster = 'clcwayfindercluster.jse1mdk.mongodb.net';
const connectionString = `mongodb+srv://${username}:${password}@${cluster}/clc?retryWrites=true&w=majority`;

mongoose.connect(connectionString, { useUnifiedTopology: true, writeConcern: { w: 1 } })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));