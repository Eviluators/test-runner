const express = require('express');
const bodyParser = require('body-parser');
const { addToQueue } = require('./queue');
require('./runner');

const server = require('express')();

server.use(bodyParser.json());

server.post('/new-test', async (req, res) => {
  try {
    const { testSubmission } = req.body;
    console.log('Test Recieved');
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
