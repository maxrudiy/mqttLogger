import { EventEmitter } from "node:events";

const wsEventEmitter = new EventEmitter();
const mqttEventEmitter = new EventEmitter();

export { wsEventEmitter, mqttEventEmitter };
