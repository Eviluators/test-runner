const spawn = require('child_process').spawn;
const { getNextInQueue } = require('./queue');

const cwd = process.cwd();

let poller;
const pollerInterval = 1000;

let threadCount = 0;
const threadMax = process.env.THREAD_MAX || 10;

const runTest = test => {
  try {
    threadCount++;
    const first = spawn(`git clone ${test.url}.git ${test._id}`, {
      shell: true
    });
    first.on('close', () => {
      const second = spawn(`cd ${test._id} && yarn install`, {
        shell: true
      });
      second.on('close', () => {
        const third = spawn(`cd ${test._id} && yarn test:sis`, {
          shell: true
        });
        third.on('close', () => {
          const testResults = require(`${cwd}/${test._id}/testRun`);
          const fourth = spawn(`rm -rf ${cwd}/${test._id}`, {
            shell: true
          });
          fourth.on('close', () => {
            console.log('Test complete');
            test.result = testResults;
            console.log(test);
            threadCount--;
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const runner = async () => {
  try {
    if (threadCount === threadMax)
      return console.log('Waiting to finish a test before starting another');
    console.log('Polling the queue for new submissions');
    clearInterval(poller);
    const test = getNextInQueue();
    if (!!test) {
      console.log('Submission found, running test');

      const tested = runTest(test);
    } else {
      console.log('No submissions found');
    }
    poller = setInterval(() => runner(), pollerInterval);
  } catch (error) {
    console.log(error);
  }
};

// IIF To start runner
(function() {
  try {
    poller = setInterval(() => runner(), pollerInterval);
  } catch (error) {
    console.log(error);
  }
})();
