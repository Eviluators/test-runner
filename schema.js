const mongoose = require('mongoose');
const { DB_URI } = require('./config');

mongoose.Promise = global.Promise;

const options = {
  useMongoClient: true,
  promiseLibrary: global.Promise
};

const SubmissionSchema = new mongoose.Schema({
  sprint: mongoose.Schema.Types.ObjectId,
  student: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
  },
  submission_date: Date,
  status: String,
  results: Object
});

const Submission = mongoose.model('Submission', SubmissionSchema);

mongoose.connect(DB_URI, options, error => {
  if (!!error) return console.log('Error connecting to the database', error);
  console.log('Eviluators db connected successfully');
});

module.exports = Submission;