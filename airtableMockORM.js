const stall = async (stalltime = 2000) => {
  await new Promise(resolve => setTimeout(resolve, stalltime));
};

const actions = {
  getStudent: async username => {
    await stall();
    return {
      id: 'reccRTg1C2iQH6Cg8',
      fields: { 'Github Username': username, ID: 1, 'Test Results': [] },
      createdTime: '2018-01-16T06:57:10.000Z'
    };
  },
  newTestResult: async fields => {
    await stall();
    return {
      id: 'rec6Wz9Qmk0ohUk8q',
      fields: {
        ID: 34,
        'Student ID': [Array],
        Results: "{ 'ha ha you failed': 'true' }",
        'Test Suite': 'Jest',
        'Run Time': 12345,
        'PR Url': 'www.justatest.com',
        'Repository Name': 'A Fake Repo Here',
        Created: '2018-01-30T19:47:00.000Z'
      },
      createdTime: '2018-01-30T19:47:00.766Z'
    };
  }
};

module.exports = actions;
