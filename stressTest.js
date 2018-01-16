const { addToQueue } = require('./store');
require('./runner');

const newTest = runCount => {
  while (runCount) {
    runCount--;
    addToQueue({
      'Student ID': `${runCount}`,
      'PR Url': 'https://github.com/phytertek/Advanced-JavaScript'
    });
  }
};

module.exports = {
  newTest
};
