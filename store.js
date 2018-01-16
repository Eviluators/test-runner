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
    this.interval = state.interval || 3000;
    this.maxThreadCount = state.maxThreadCount || 4;
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
}

let state = new State();

const setState = updatedState => {
  state = new State({ ...state.clone, ...updatedState });
};

const action = {
  getBestRunTime: () => state.tuneData.bestRunTimeTotal,
  getRunTimeAvg: () => state.runTimeAvg,
  runTimeLogLength: () => state.runTimeLog.length,
  getBestRunTimeAvg: () => state.tuneData.bestRunTimeAvg,
  tunerOn: () => setState({ tunerMode: true }),
  tunerOff: () => setState({ tunerMode: false }),
  getTunerTestCount: () => state.tuneData.testsToRun,
  getInterval: () => state.interval,
  getMaxThreadCount: () => state.maxThreadCount,
  clearQueues: () => {
    const queue = state.queue.spawn;
    const runTimeLog = state.runTimeLog.spawn;
    setState({ queue, runTimeLog });
  },
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
    const backupRunTimeLog = state.backupRunTimeLog.clone;
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
    interval -= 500;
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
