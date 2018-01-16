const Airtable = require('airtable');

const apiKey = process.env.AIRTABLE_API_KEY || 'keysRGO1v32tbkj2X';
const root = process.env.AIRTABLE_ROOT || 'appUqpw2k7cfrkkC8';

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
      console.log(fields);
      const testResult = await Test_Result.create(fields || {});
      return testResult;
    } catch (error) {
      throw new Error(error);
    }
  }
};

module.exports = actions;
