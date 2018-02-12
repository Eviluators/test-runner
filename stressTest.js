const { addToQueue } = require('./store');
require('./runner');

const newTest = runCount => {
  while (runCount) {
    runCount--;
    if (runCount % 2 === 0) {
      addToQueue({
        'Student ID': `${runCount}`,
        'PR Url': 'https://github.com/phytertek/Advanced-JavaScript'
      });
    } else {
      addToQueue({
        'Student ID': `${runCount}`,
        'PR Url': 'https://github.com/phytertek/phytertek_Mocha-tests'
      });
    }
  }
};

module.exports = {
  newTest
};
