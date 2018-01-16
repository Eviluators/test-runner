const spawn = require('child_process').spawn;
const store = require('./store');
const { newTestResult } = require('./airtable');

const cwd = process.cwd();

let poller;

let threadCount = 0;

const runTest = test => {
  try {
    threadCount++;
    const startTime = Date.now();
    console.log('Starting Test');
    console.log(cwd);
    const first = spawn(
      `git clone ${test['PR Url']}.git ${test['Student ID']}`,
      {
        shell: true
      }
    );
    first.on('close', () => {
      console.log('Finished Clone');
      const second = spawn(`cd ${test['Student ID']} && yarn install`, {
        shell: true
      });
      second.on('close', () => {
        console.log('Finished Install');
        const third = spawn(`cd ${test['Student ID']} && yarn test:sis`, {
          shell: true
        });
        third.on('close', () => {
          console.log('Finished Test Run');
          console.log(`${cwd}/${test['Student ID']}/testRun`);
          const testResults = require(`${cwd}/${test['Student ID']}/testRun`);
          const fourth = spawn(`rm -rf ${cwd}/${test['Student ID']}`, {
            shell: true
          });
          fourth.on('close', () => {
            console.log('Writing Results');
            test['Results'] = testResults;
            test['Pass'] = !!testResults.numFailedTests;
            const runTime = Date.now() - startTime;
            threadCount--;
            store.setRunTimeLog(runTime);
            console.log('In tuner mode?', store.inTuneMode());
            if (!store.inTuneMode()) {
              newTestResult(test);
            }
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const runner = () => {
  try {
    const maxThreads = store.getMaxThreadCount();
    if (threadCount >= maxThreads) return; //console.log('Waiting to finish a test before starting another');
    // console.log('Polling the queue for new submissions');
    clearInterval(poller);
    const test = store.nextFromQueue();
    if (!!test) {
      // console.log('Submission found, running test');
      const tested = runTest(test);
      // Return test results to Airtable
    } else {
      // console.log('No submissions found');
    }
    poller = setInterval(() => runner(), store.getInterval());
  } catch (error) {
    console.log(error);
  }
};

// IIF To start runner
(function() {
  try {
    poller = setInterval(() => runner(), store.getInterval());
  } catch (error) {
    console.log(error);
  }
})();
