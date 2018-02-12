const Airtable = require('airtable');
const mockActions = require('./airtableMockORM');
const apiKey = process.env.AIRTABLE_API_KEY;
const root = process.env.AIRTABLE_ROOT;

const Student = new Airtable({ apiKey }).base(root)('Students');
const Test_Result = new Airtable({ apiKey }).base(root)('Test Results');

const actions = {
  getStudent: async username => {
    try {
      const query = Student.select({
        maxRecords: 1,
        filterByFormula: `{Github Username} = "${username}"`
      });
      const results = await query.firstPage();
      return results[0];
    } catch (error) {
      throw new Error(error);
    }
  },
  newTestResult: async fields => {
    try {
      const testResult = await Test_Result.create(fields || {});
      return testResult;
    } catch (error) {
      throw new Error(error);
    }
  }
};

module.exports = process.env.NODE_ENV !== 'test' ? actions : mockActions;
