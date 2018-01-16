const server = require('express')();
const bodyParser = require('body-parser');
const http = require('http');
const store = require('./store');
const startTuner = require('./tune');
const { getStudent } = require('./airtable');
require('./runner');

server.use(bodyParser.json());
server.use(cors());
server.use(helmet());

server.post('/start-tune', async (req, res) => {
  try {
    const { auth } = req.body;
    if (auth === process.env.TUNER_AUTH) {
      startTuner();
    }
    res.sendStatus(200);
  } catch (error) {
    res.json(error);
  }
});

server.post('/new-test', async (req, res) => {
  try {
    if (req.body.action === 'opened') {
      const { pull_request } = req.body;
      const student = await getStudent(pull_request.user.login);
      const testSubmission = {
        'Student ID': student.getId(),
        'PR Url': pull_request.head.repo.html_url,
        'Repository Name': pull_request.head.repo.name
      };
      if (store.inTunerMode()) {
        store.addToBackupQueue(testSubmission);
      } else {
        store.addToQueue(testSubmission);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    res.json(error);
  }
});

server.listen(3434, error => {
  if (error) return console.log(error);
  console.log('Test-runner api running on port 3434');
});
