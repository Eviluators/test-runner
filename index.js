const server = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const store = require('./store');
const startTuner = require('./tune');
const { getStudent } = require('./airtable');
require('./runner');

server.use(cors());
server.use(helmet());
server.use(bodyParser.json());

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
    console.log(req.body.action === 'opened');
    if (req.body.action === 'opened') {
      console.log('One');
      const { pull_request } = req.body;
      console.log('two', pull_request.user.login);
      const student = await getStudent(pull_request.user.login);
      console.log('three');
      const testSubmission = {
        // 'Student ID': student.id,
        'Student ID': 'reccRTg1C2iQH6Cg8',
        'PR Url': pull_request.head.repo.html_url,
        'Repository Name': pull_request.head.repo.name
      };
      console.log('*** TEST SUBMISSION ***', testSubmission);
      if (store.inTuneMode()) {
        store.addToBackupQueue(testSubmission);
      } else {
        store.addToQueue(testSubmission);
      }
    }
    res.json(req.body);
  } catch (error) {
    res.json(error);
  }
});

server.listen(process.env.PORT || 3434, error => {
  if (error) return console.log(error);
  console.log(`Test-runner api running on port ${process.env.PORT || 3434}`);
});
