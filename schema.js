const mongoose = require('mongoose');
const { DB_URI } = require('./config');

mongoose.Promise = global.Promise;

const options = {
  useMongoClient: true,
  promiseLibrary: global.Promise
};

const SubmissionSchema = new mongoose.Schema({
  submission_date: {
    type: Date
  },
  status: {
    type: String
  },
  result: {
    type: String
  }
});

const Submission = mongoose.model('Submission', SubmissionSchema);

mongoose.connect(DB_URI, options, error => {
  if (!!error) return console.log('Error connecting to the database', error);
  console.log('Eviluators db connected successfully');
});

module.exports = Submission;
