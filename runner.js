const spawn = require('child_process').spawn;
const store = require('./store');
const { newTestResult } = require('./airtable');

const cwd = process.cwd();

let poller;

let threadCount = 0;

const runTest = (test, cb) => {
  try {
    threadCount++;
    const startTime = Date.now();
    const first = spawn(
      `git clone ${test['PR Url']}.git ${test['Student ID']}${startTime}`,
      {
        shell: true
      }
    );
    if (cb) return cb({ ...test, first }); // needed for git test to exit
    first.on('close', () => {
      const second = spawn(
        `cd ${test['Student ID']}${startTime} && yarn install`,
        {
          shell: true
        }
      );
      second.on('close', () => {
        const third = spawn(
          `cd ${test['Student ID']}${startTime} && yarn test:sis`,
          {
            shell: true
          }
        );
        third.on('close', () => {
          const testResults = require(`${cwd}/${
            test['Student ID']
          }${startTime}/testRun`);
          const fourth = spawn(
            `rm -rf ${cwd}/${test['Student ID']}${startTime}`,
            {
              shell: true
            }
          );
          fourth.on('close', () => {
            const runTime = Date.now() - startTime;
            // Determine if tests are from Mocha or Jest
            if (testResults.hasOwnProperty('numFailedTests')) {
              // Jest
              test['Test Suite'] = 'Jest';
              test['Pass'] = testResults.numFailedTests === 0;
            } else {
              // Mocha
              test['Test Suite'] = 'Mocha';
              test['Pass'] = testResults.stats.failures === 0;
            }
            test['Results'] = JSON.stringify(testResults);
            test['Student ID'] = [`${test['Student ID']}`];
            test['Run Time'] = runTime;
            threadCount--;
            console.log(`Test Finished in: ${runTime}ms`);
            store.setRunTimeLog(runTime);
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

module.exports = { runTest };
