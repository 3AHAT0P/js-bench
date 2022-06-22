const { PerformanceObserver, performance } = require('node:perf_hooks');

const createAndFillMap = (numberOfElements) => {
  const o = new Map();
  for (let i = 0; i < numberOfElements; i += 1) o.set('i-' + i, i);
  return o;
}

const createAndFillObject = (numberOfElements) => {
  const o = {};
  for (let i = 0; i < numberOfElements; i += 1) o['i-' + i] = i;
  return o;
}

const createAndFillNullObject = (numberOfElements) => {
  const o = Object.create(null);
  for (let i = 0; i < numberOfElements; i += 1) o['i-' + i] = i;
  return o;
}

const readSomeTimesMap = (o, numberOfElements) => {
  let sum = 0;
  for (let i = 0; i < numberOfElements; i += 1) {
    sum += o.get('i-' + i);
  }
  return sum;
}

const readSomeTimesObject = (o, numberOfElements) => {
  let sum = 0;
  for (let i = 0; i < numberOfElements; i += 1) {
    sum += o['i-' + i];
  }
  return sum;
}

const checkAndReadSomeTimesMap = (o, numberOfElements) => {
  let sum = 0;
  for (let i = 0; i < numberOfElements; i += 1) {
    if (o.has('i-' + i)) sum += o.get('i-' + i);
  }
  return sum;
}

const checkAndReadSomeTimesObject = (o, numberOfElements) => {
  let sum = 0;
  for (let i = 0; i < numberOfElements; i += 1) {
    if (('i-' + i) in o) sum += o['i-' + i];
  }
  return sum;
}

const doBench = (fn, times = 1e6, ...args) => {
  const timeArray = [];
  let minTime = Number.MAX_SAFE_INTEGER;
  let maxTime = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < times; i += 1) {
    const t1 = performance.now();
    fn(...args);
    const t2 = performance.now();
    const delta = t2 - t1;
    timeArray.push(delta);
    if (minTime > delta) minTime = delta;
    if (maxTime < delta) maxTime = delta;
  }
  const avg = timeArray.reduce((acc, n) => acc + n, 0) / times;
  return {
    avg,
    max: maxTime,
    min: minTime,
  };
}

const log = (label, obj) => {
  console.log(`${label} => min: ${obj.min}; avg: ${obj.avg}; max: ${obj.max};`);
}

const main = () => {
  const times = 100;
  log('createAndFillMap 100 records', doBench(createAndFillMap, times, 100));
  log('createAndFillObject 100 records', doBench(createAndFillObject, times, 100));
  log('createAndFillNullObject 100 records', doBench(createAndFillNullObject, times, 100));
  log('createAndFillMap 1e6 records', doBench(createAndFillMap, times, 1e5));
  log('createAndFillObject 1e6 records', doBench(createAndFillObject, times, 1e5));
  log('createAndFillNullObject 1e6 records', doBench(createAndFillNullObject, times, 1e5));
  console.log('------------------------------');
  const o100 = createAndFillObject(100);
  const o1e5 = createAndFillObject(1e5);
  const on100 = createAndFillNullObject(100);
  const on1e5 = createAndFillNullObject(1e5);
  const m100 = createAndFillMap(100);
  const m1e5 = createAndFillMap(1e5);
  log('readSomeTimesMap 100 times from Map size 100', doBench(readSomeTimesMap, times, m100, 100));
  log('readSomeTimesObject 100 times from Object size 100', doBench(readSomeTimesObject, times, o100, 100));
  log('readSomeTimesObject 100 times from NULL Object size 100', doBench(readSomeTimesObject, times, on100, 100));
  log('readSomeTimesMap 1e6 times from Map size 1e6', doBench(readSomeTimesMap, times, m1e5, 1e5));
  log('readSomeTimesObject 1e6 times from Object size 1e6', doBench(readSomeTimesObject, times, o1e5, 1e5));
  log('readSomeTimesObject 1e6 times from NULL Object size 1e6', doBench(readSomeTimesObject, times, on1e5, 1e5));
  console.log('------------------------------');
  log('checkAndReadSomeTimesMap 100 times from Map size 100', doBench(checkAndReadSomeTimesMap, times, m100, 100));
  log('checkAndReadSomeTimesObject 100 times from Object size 100', doBench(checkAndReadSomeTimesObject, times, o100, 100));
  log('checkAndReadSomeTimesObject 100 times from NULL Object size 100', doBench(checkAndReadSomeTimesObject, times, on100, 100));
  log('checkAndReadSomeTimesMap 1e6 times from Map size 1e6', doBench(checkAndReadSomeTimesMap, times, m1e5, 1e5));
  log('checkAndReadSomeTimesObject 1e6 times from Object size 1e6', doBench(checkAndReadSomeTimesObject, times, o1e5, 1e5));
  log('checkAndReadSomeTimesObject 1e6 times from NULL Object size 1e6', doBench(checkAndReadSomeTimesObject, times, on1e5, 1e5));
}

main();
