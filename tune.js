const store = require('./store');
const { newTest } = require('./stressTest');

const standAlone = process.argv[2] === '-i' || false;
let iterations = 0;

// First Run
const firstRun = next => {
  const startTime = Date.now();
  newTest(store.getTunerTestCount());
  console.log('*****************************');
  console.log('*** Base Run Starting ***');
  console.log('*****************************');
  const queuePoller = setInterval(() => {
    if (store.runTimeLogLength() === store.getTunerTestCount()) {
      const runTime = Date.now() - startTime;
      clearInterval(queuePoller);
      store.logBestTune(runTime);
      console.log('*****************************');
      console.log('*** Base Run Results ***');
      console.log(`*** Total Run Time:  ${store.getBestRunTime()}`);
      console.log(`*** Thread Count:  ${store.getMaxThreadCount()}`);
      console.log(`*** Poller Interval: ${store.getInterval()}`);
      console.log(`*** Run Time Avg: ${store.getBestRunTimeAvg()}`);
      console.log('*****************************');
      next();
    }
  }, 100);
};

// Iterate through increasing maxThreadCount until no gains in runTimeAvg
const increaseMaxThreadCount = next => {
  const startTime = Date.now();
  store.incMaxThreadCount();
  store.clearQueues();
  console.log('*****************************');
  console.log(`*** Max Thread Count Inc: ${store.getMaxThreadCount()} ***`);
  console.log('*****************************');
  newTest(store.getTunerTestCount());
  const queuePoller = setInterval(() => {
    if (store.runTimeLogLength() === store.getTunerTestCount()) {
      const runTime = Date.now() - startTime;
      clearInterval(queuePoller);
      if (runTime > store.getBestRunTime()) {
        store.logBestTune();
        console.log(`*** Total Run Time:  ${runTime}`);
        increaseMaxThreadCount(next);
      } else {
        store.setBestTune();
        console.log('*****************************');
        console.log('*** Max Thread Count ***');
        console.log(`*** Total Run Time:  ${store.getBestRunTime()}`);
        console.log(`*** Optimal Thread Count:  ${store.getMaxThreadCount()}`);
        console.log(`*** Optimal Poller Interval: ${store.getInterval()}`);
        console.log(`*** Optimal Run Time Avg: ${store.getBestRunTimeAvg()}`);
        console.log('*****************************');
        next();
      }
    }
  }, 100);
};

// Iterate through increasing interval until no gains in runTimeAvg
const increaseInterval = next => {
  const startTime = Date.now();
  store.incInterval();
  store.clearQueues();
  console.log('*****************************');
  console.log(`*** Interval Inc: ${store.getInterval()} ***`);
  console.log('*****************************');
  newTest(store.getTunerTestCount());
  const queuePoller = setInterval(() => {
    if (store.runTimeLogLength() === store.getTunerTestCount()) {
      const runTime = Date.now() - startTime;
      clearInterval(queuePoller);
      if (runTime > store.getBestRunTime()) {
        store.logBestTune();
        console.log(`*** Total Run Time:  ${runTime}`);
        increaseInterval(next);
      } else {
        store.setBestTune();
        console.log('*****************************');
        console.log('*** Max Interval ***');
        console.log(`*** Total Run Time:  ${store.getBestRunTime()}`);
        console.log(`*** Optimal Thread Count:  ${store.getMaxThreadCount()}`);
        console.log(`*** Optimal Poller Interval: ${store.getInterval()}`);
        console.log(`*** Optimal Run Time Avg: ${store.getBestRunTimeAvg()}`);
        console.log('*****************************');
        next();
      }
    }
  }, 100);
};

const decreaseMaxThreadCount = next => {
  const startTime = Date.now();
  store.decMaxThreadCount();
  store.clearQueues();
  console.log('*****************************');
  console.log(`*** Max Thread Count Dec: ${store.getMaxThreadCount()} ***`);
  console.log('*****************************');
  newTest(store.getTunerTestCount());
  const queuePoller = setInterval(() => {
    if (store.runTimeLogLength() === store.getTunerTestCount()) {
      const runTime = Date.now() - startTime;
      clearInterval(queuePoller);
      if (runTime > store.getBestRunTime()) {
        store.logBestTune();
        console.log(`*** Total Run Time:  ${runTime}`);
        decreaseMaxThreadCount(next);
      } else {
        store.setBestTune();
        console.log('*****************************');
        console.log('*** Min Thread Count ***');
        console.log(`*** Total Run Time:  ${store.getBestRunTime()}`);
        console.log(`*** Optimal Thread Count:  ${store.getMaxThreadCount()}`);
        console.log(`*** Optimal Poller Interval: ${store.getInterval()}`);
        console.log(`*** Optimal Run Time Avg: ${store.getBestRunTimeAvg()}`);
        console.log('*****************************');
        next();
      }
    }
  }, 100);
};

const decreaseInterval = next => {
  const startTime = Date.now();
  store.decInterval();
  store.clearQueues();
  console.log('*****************************');
  console.log(`*** Interval Dec: ${store.getInterval()} ***`);
  console.log('*****************************');
  newTest(store.getTunerTestCount());
  const queuePoller = setInterval(() => {
    if (store.runTimeLogLength() === store.getTunerTestCount()) {
      const runTime = Date.now() - startTime;
      clearInterval(queuePoller);
      if (runTime > store.getBestRunTime() || store.getInterval <= 0) {
        store.logBestTune();
        console.log(`*** Total Run Time:  ${runTime}`);
        decreaseInterval(next);
      } else {
        store.setBestTune();
        console.log('*****************************');
        console.log('*** Min Interval ***');
        console.log(`*** Total Run Time:  ${store.getBestRunTime()}`);
        console.log(`*** Optimal Thread Count:  ${store.getMaxThreadCount()}`);
        console.log(`*** Optimal Poller Interval: ${store.getInterval()}`);
        console.log(`*** Optimal Run Time Avg: ${store.getBestRunTimeAvg()}`);
        console.log('*****************************');
        next();
      }
    }
  }, 100);
};
const tuneSequence = () => {
  iterations++;
  increaseMaxThreadCount(() =>
    decreaseInterval(() =>
      decreaseMaxThreadCount(() => increaseInterval(() => finishTune()))
    )
  );
};
const startTuner = () => {
  store.backupQueues();
  store.tunerOn();
  firstRun(() => tuneSequence());
};
// Finish Tune
const finishTune = () => {
  console.log('*****************************');
  console.log('*****************************');
  console.log(
    iterations < 5 ? `*** Finished ${iterations} iteration` : '***Final***'
  );
  console.log('*****************************');
  console.log('*****************************');
  console.log(`*** Optimal Thread Count:  ${store.getMaxThreadCount()}`);
  console.log(`*** Optimal Poller Interval: ${store.getInterval()}`);
  console.log(`*** Optimal Run Time Avg: ${store.getBestRunTimeAvg()}`);
  console.log('*****************************');
  console.log('*****************************');
  if (iterations === 5) {
    iterations = 0;
    store.restoreQueues();
    store.tunerOff();
  } else {
    tuneSequence();
  }
};

module.exports = startTuner;

if (standAlone) {
  require('./runner');
  startTuner();
}
