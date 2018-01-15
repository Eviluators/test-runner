const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { addToQueue } = require('./queue');
require('./runner');

const server = require('express')();

server.use(bodyParser.json());
server.use(cors());
server.use(helmet());

server.post('/new-test', async (req, res) => {
  try {
    const testSubmission = {
      url: req.body.pull_request.head.repo.html_url,
      _id: req.body.pull_request.head.repo.id
    }
    console.log('Test Received');
    addToQueue(testSubmission);
    res.json({ success: true });
  } catch (error) {
    res.json(error);
  }
});

server.listen(3434, error => {
  if (error) return console.log(error);
  console.log('Test-runner api running on port 3434');
});
