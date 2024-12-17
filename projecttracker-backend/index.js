const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/project_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const candidateRoutes = require('./routes/candidate');
app.use('/api', candidateRoutes);

app.listen(8080, () => console.log(`Server running on http://localhost:${8080}`));
