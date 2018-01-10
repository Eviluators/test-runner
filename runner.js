const spawn = require('child_process').spawnSync;
const Submission = require('./schema');

const cwd = process.cwd();

let poller;
const pollerInterval = 10000;

// new Submission({

// }).save();

const runTest = test => {
  try {
    spawn(`git clone ${test.url}.git ${test._id}`, { shell: true });
    spawn(`cd ${test._id} && yarn install`, { shell: true });
    spawn(`cd ${test._id} && yarn test:sis`, { shell: true });
    const testResults = require(`${cwd}/${test._id}/testRun`);
    spawn(`rm -rf ${cwd}/${test._id}`, { shell: true });
    console.log('Test complete');
    test.status = 'finished';
    test.result = testResults;
    return test;
  } catch (error) {
    console.log(error);
  }
};

const runner = async () => {
  try {
    console.log('Polling the db for new submissions');
    clearInterval(poller);
    const test = await Submission.findOneAndUpdate(
      {status: 'queued'},
      {status: 'running'},
      { sort:{ submission_date: 1 }}
    );
    console.log(test);
    if (!!test) {
      console.log('Submission found, running test');
      /** There is a lot of room for improvement here... If the test-runner
       * service ever scales beyond a single instance, colissions will likely
       * occur when two pollers are active at the same time -- ie. both will poll the db
       * and get the same record, then they'll both try to save to that record with
       * the new status -- no bueno -- we need a mechanism for locking a record in the
       * db before it is returned as a result */

      // Mongo comes with a global write lock so only one write can occur at the same time.
      // this write lock takes precendence over a read
      // however more than one reads can occur at the same time..
      // so by using a findoneandupdate it should lock from any other findoneandupdate queries
      
      const tested = runTest(test);
      await tested.save();
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
