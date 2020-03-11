const functions = {
  add: (waterHeater) => add(waterHeater),
  remove: (waterHeater) => remove(waterHeater),
  schedule: (waterHeater) => schedule(waterHeater),
  doActions: (waterHeater) => doActions(waterHeater),
}

const state = {
  OFF: 0,
  STANDBY: 1,
  ON: 2,
}

let nextId = 0;
let testerWaterHeater = {
  id: NaN, // ID
  currentTemp: 55, // Current temperature
  lowerLimit: 55, // When under it should start
  upperLimit: 85, // When abow it turns off
  effect: 1000, // Watts
  state: 1, // 0 = off, 1 = standby, 2 = full power
  timeOn: undefined,
  timeOff: undefined,
}

let waterHeater = undefined;

add(testerWaterHeater);
const timer = setInterval(function() {
  update(waterHeater);
}, 1000);

function add(_waterHeater) {
  _waterHeater.id = nextId;
  nextId++;
  waterHeater = _waterHeater;
}

function remove(waterHeater) {
  waterHeater = undefined;
}

function update(waterHeater) {
  if (waterHeater.timeOn == undefined && waterHeater.timeOff == undefined)
    schedule(waterHeater);
  doActions(waterHeater);
}

function schedule(waterHeater) {
  let date = new Date();
  date.setSeconds(date.getSeconds() + 5);
  waterHeater.timeOn = date;

  date = new Date();
  date.setSeconds(date.getSeconds() + 10);
  waterHeater.timeOff = date;

  console.log("Time to turn on " + waterHeater.timeOn.getHours() + ":" + waterHeater.timeOn.getMinutes() + ":" + waterHeater.timeOn.getSeconds());
  console.log("Time to turn off " + waterHeater.timeOff.getHours() + ":" + waterHeater.timeOff.getMinutes() + ":" + waterHeater.timeOff.getSeconds());
}

function doActions(waterHeater) {
  let date = new Date();
  if (waterHeater.timeOn !== undefined && waterHeater.state != state.ON) {
    if (waterHeater.timeOn <= date) {
      turnOnWaterHeater(waterHeater);
    }
  } else if (waterHeater.timeOff !== undefined && waterHeater.state != state.OFF) {
    if (waterHeater.timeOff <= date) {
      turnOffWaterHeater(waterHeater);
    }
  }
}

function turnOnWaterHeater(waterHeater) {
  waterHeater.state = state.ON;
  notifyWaterHeater(waterHeater.state);
}

function turnOffWaterHeater(waterHeater) {
  waterHeater.state = state.OFF;
  waterHeater.timeOn = undefined;
  waterHeater.timeOff = undefined;
  notifyWaterHeater(waterHeater.state);
}

function notifyWaterHeater(_state) {
  console.log("Commanding Water Heater to turn " + _state.toString());
}

module.exports = functions;