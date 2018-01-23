const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

const runner = require('./runner');

const test =  {
  url: 'https://github.com/dys2/DYS2-hooks',
  _id: 999999999,
}

let path;

const gitTest = new Promise((resolve, reject) => {
  const cb = sinon.spy();
  runner.runTest(test, cb);
  const { first } = cb.args[0][0];
  let exists;
  first.on('close', function() {
  path = `${process.cwd()}/${cb.args[0][0]._id}/`;
  exists = fs.existsSync(path);
  resolve(true);
  })
});

const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};


describe('runTest', () => {
  describe('git', () => {
    after(() => deleteFolderRecursive(path));
    it('should clone the repository', () => {
      return expect(Promise.resolve(gitTest)).to.eventually.be.true;
    });
  });
});
