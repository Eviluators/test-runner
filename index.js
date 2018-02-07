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

// might be worth separating this into it's own file
const checkGitHub = (req) => {
  if (!req.headers['user-agent'].includes('GitHub-Hookshot')) {
    return false;
  }
  const theirSignature = req.headers['x-hub-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.GITHUB_SECRET_TOKEN;
  const ourSignature = `sha1=${crypto.createHmac('sha1', secret).update(payload).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(theirSignature), Buffer.from(ourSignature));
};

const notAuthorized = (req, res) => {
  console.log("Request from non-GitHub webhook. Redirecting.");
  res.redirect(301, '/');
}

server.get('/', (req, res) => {
  res.json({ msg: 'Github webhooks only' });
});

server.post('/start-tune', async (req, res) => {
  try {
    if (checkGitHub(req)) {
      console.log("Request from GitHub webhook verified.")
      const { auth } = req.body;
      if (auth === process.env.TUNER_AUTH) {
        startTuner();
      }
      res.sendStatus(200);
    } else {
      notAuthorized(req, res);
    }
  } catch (error) {
    res.json(error);
  }
});

server.post('/new-test', async (req, res) => {
  try {
    if (checkGitHub(req)) {
      console.log("Request from GitHub webhook verified.")
      console.log(req.body.action === 'opened');
      if (req.body.action === 'opened') {
        console.log('One');
        const { pull_request } = req.body;
        console.log('two', pull_request.user.login);
        const student = await getStudent(pull_request.user.login);
        console.log('three');
        const testSubmission = {
          'Student ID': student.id,
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
    } else {
      notAuthorized(req, res);
    }
  } catch (error) {
    res.json(error);
  }
});

const PORT = process.env.PORT || 3434;
const HOST = process.env.HOST || '0.0.0.0';
module.exports = server.listen(PORT, HOST, error => {
  if (error) return console.log(error);
  console.log(`Test-runner api running on http://${HOST}:${PORT}`);
});
