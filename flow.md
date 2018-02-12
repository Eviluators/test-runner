### Tuner Mode

Rec. req on expr.route ->

Turn on tune mode ->
move items in queue to backup queue,
redirect all new requested tests to backup queue untill tuner finished
clear the primary queue
backup active logs
clear active logs
fill queue
tests run
poll queue length until 0

enter first runTimeAvg as bestRunTimeAvg

iterate up, increasing maxThreadCount until runTimeAvg does not beat bestRunTimeAvg

iterate up, increasing interval until runTimeAvg does not beat bestRunTimeAvg

iterateDown, decreasing maxThreadCount until runTimeAvg does not beat bestRunTimeAvg

iterate down, decreasing interval until runTimeAvg does not beat bestRunTimeAvg

when iterations complete, clear logs, move items from backupQueue to queue, move items from backupRunTImeLog to runTimeLog
turn off tunemode

## Test Run

rec. req on expr route
req test added to queue (redux)
runner grabs next test from queue (redux)
sets runTimeStart (redux action)
runs tests
sets runTimeEnd (redux action - also calculates time distance from runTimeStart and adds it to the runTimeLog, triggering a runTimeAvg calculation)
iterate through items in queue until empty
