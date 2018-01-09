const spawn = require('child_process').spawn;
const Submissions = require('./schema');

const cwd = process.cwd();

let poller;
const pollerInterval = 10000;

const runTest = test => {
  spawn(
    [
      `git clone ${test.repoUrl}.git ${test._id}`,
      `cd ${test._id}`,
      `yarn install`,
      `yarn test:sis`
    ].join(' && '),
    { shell: true }
  );
  const testResults = require(`${cwd}/${test._id}/testRun`);
  spawn(`rm -rf ${cwd}/${test._id}`, { shell: true });
  test.status = 'finished';
  test.results = testResults;
  return test;
};

const runner = async () => {
  try {
    clearInterval(poller);
    const test = await Submissions.find()
      .sort({ created: 1 })
      .limit(1);
    if (!!test) {
      test.status = 'running';
      /** There is a lot of room for improvement here... If the test-runner
       * service ever scales beyond a single instance, colissions will likely
       * occur when two pollers are active at the same time -- ie. both will poll the db
       * and get the same record, then they'll both try to save to that record with
       * the new status -- no bueno -- we need a mechanism for locking a record in the
       * db before it is returned as a result */
      await test.save();
      const tested = runTest(test);
      await tested.save();
    }
    poller = setInterval(async () => runner(), pollerInterval);
  } catch (error) {}
};

// IIF To start runner
(function async() {
  try {
    setInterval(async () => runner(), 10000);
  } catch (error) {
    console.log(error);
  }
});
