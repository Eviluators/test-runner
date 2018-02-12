class Queue {
  constructor(items) {
    this.queue = items || [];
  }
  get length() {
    return this.queue.length;
  }
  get next() {
    return this.queue.shift();
  }
  add(item) {
    return this.queue.push(item);
  }
  get clone() {
    const clonedQueue = [...this.queue];
    return new Queue(clonedQueue);
  }
  get avg() {
    const total = this.queue.reduce((t, e) => t + e);
    return total / this.length;
  }
  get spawn() {
    return new Queue();
  }
}

class State {
  constructor(state = {}) {
    this.queue = state.queue || new Queue();
    this.backupQueue = state.backupQueue || new Queue();
    this.interval = state.interval || 0;
    this.maxThreadCount = state.maxThreadCount || 1;
    this.runTimeLog = state.runTimeLog || new Queue();
    this.backupRunTimeLog = state.backupRunTimeLog || new Queue();
    this.runTimeAvg = state.runTimeAvg || '';
    this.tuneMode = state.tuneMode || false;
    this.tuneData = state.tuneData || {
      testsToRun: 5,
      bestRunTimeAvg: '',
      bestRunTimeTotal: '',
      bestInterval: 3000,
      bestMaxThreadCount: 4
    };
  }
  get clone() {
    const clonedState = {
      ...this,
      queue: this.queue.clone,
      backupQueue: this.backupQueue.clone,
      runTimeLog: this.runTimeLog.clone,
      backupRunTimeLog: this.backupRunTimeLog.clone,
      tuneData: { ...this.tuneData }
    };
    return new State(clonedState);
  }
  get tuneDataClone() {
    return { ...this.tuneData };
  }
}

let state = new State();

const setState = updatedState => {
  state = new State({ ...state.clone, ...updatedState });
};

const action = {
  setTestsToRun: count =>
    setState({ tuneData: { ...state.tuneDataClone, testsToRun: count } }),
  inTuneMode: () => state.tuneMode,
  getBestRunTime: () => state.tuneData.bestRunTimeTotal,
  getRunTimeAvg: () => state.runTimeAvg,
  runTimeLogLength: () => state.runTimeLog.length,
  getBestRunTimeAvg: () => state.tuneData.bestRunTimeAvg,
  tunerOn: () => setState({ tuneMode: true }),
  tunerOff: () => setState({ tuneMode: false }),
  getTunerTestCount: () => state.tuneData.testsToRun,
  getInterval: () => state.interval,
  getMaxThreadCount: () => state.maxThreadCount,
  clearQueues: () => {
    const queue = state.queue.spawn;
    const runTimeLog = state.runTimeLog.spawn;
    setState({ queue, runTimeLog });
  },
  getQueue: () => state.queue.clone,
  addToQueue: item => {
    const queue = state.queue.clone;
    queue.add(item);
    setState({ queue });
  },
  addToBackupQueue: item => {
    const backupQueue = state.backupQueue.clone;
    backupQueue.add(item);
    setState({ backupQueue });
  },
  nextFromQueue: () => {
    const queue = state.queue.clone;
    const next = queue.next;
    setState({ queue });
    return next;
  },
  backupQueues: () => {
    const backupQueue = state.queue.clone;
    const backupRunTimeLog = state.runTimeLog.clone;
    const queue = state.queue.spawn;
    const runTimeLog = state.runTimeLog.spawn;
    setState({ backupQueue, backupRunTimeLog, queue, runTimeLog });
  },
  restoreQueues: () => {
    const queue = state.backupQueue.clone;
    const runTimeLog = state.backupRunTimeLog.clone;
    setState({ queue, runTimeLog });
  },
  queueLength: () => state.queue.length,
  setRunTimeLog: runTime => {
    const runTimeLog = state.runTimeLog.clone;
    runTimeLog.add(runTime);
    const runTimeAvg = runTimeLog.avg;
    setState({ runTimeLog, runTimeAvg });
  },
  incMaxThreadCount: () => {
    let maxThreadCount = state.maxThreadCount;
    maxThreadCount++;
    const tuneData = state.tuneDataClone;
    if (maxThreadCount >= tuneData.testsToRun) {
      tuneData.testsToRun *= 2;
    }
    setState({ maxThreadCount });
  },
  incInterval: () => {
    let interval = state.interval;
    interval += 500;
    setState({ interval });
  },
  decMaxThreadCount: () => {
    let maxThreadCount = state.maxThreadCount;
    maxThreadCount--;
    setState({ maxThreadCount });
  },
  decInterval: () => {
    let interval = state.interval;
    if (interval > 0) interval -= 500;
    setState({ interval });
  },
  logBestTune: time => {
    const tuneData = {
      ...state.tuneData,
      bestRunTimeTotal: time,
      bestRunTimeAvg: state.runTimeAvg,
      bestInterval: state.interval,
      bestMaxThreadCount: state.maxThreadCount
    };
    setState({ tuneData });
  },
  setBestTune: () => {
    const interval = state.tuneData.bestInterval;
    const maxThreadCount = state.tuneData.bestMaxThreadCount;
    setState({ interval, maxThreadCount });
  }
};

module.exports = action;
