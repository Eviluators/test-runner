const queue = [];

module.exports = {
  addToQueue: testSubmission => queue.push(testSubmission),
  getNextInQueue: () => queue.shift()
};
