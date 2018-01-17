const whitelist = ['https://api.github.com', 'https://github.com', 'https://api.github.com/repos/Eviluators/adamlowerj-hooks/hooks']

const corsOptions = {
  origin: function (origin, cb) {
    if (whitelist.indexOf(origin) !== -1) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  }
}

module.exports = corsOptions;