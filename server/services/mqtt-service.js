import mqtt from "mqtt";
import { convertFunction, getFieldsByDataPoints } from "./functions.js";
import { deviceLibrary } from "./device-library.js";
import { SPM02V2Model } from "../models/device-models.js";
import { wsEventEmitter, mqttEventEmitter } from "../events/events.js";

const QUEUE = new Map();

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_TOPIC = process.env.MQTT_TOPIC;

const mqttClient = () => {
  let r = Math.floor(Math.random() * 10000);
  let clientId = "mqtt-" + r;

  const client = mqtt.connect(MQTT_BROKER_URL, {
    clientId,
    protocolVersion: 4,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clean: true,
  });

  client.on("connect", () => {
    console.log("Connected to mqtt broker");

    client.subscribe(`tele/${MQTT_TOPIC}/SENSOR`, () => {
      console.log(`Subscribed to topic`);
    });

    client.on("message", (topic, message) => {
      try {
        const received = JSON.parse(message.toString()).ZbReceived;
        const { name, model, hex, property, value } = convertFunction(received, deviceLibrary);

        switch (model) {
          case "SPM02V2":
            // Save the field of device to cache
            !QUEUE.has(hex) ? QUEUE.set(hex, { [property]: value }) : (QUEUE.get(hex)[property] = value);

            // Check if all required fields are present in cache and save it to database
            const REQUIRED_FIELDS = getFieldsByDataPoints(model, deviceLibrary);
            const allFieldsPresent = REQUIRED_FIELDS.every((field) => Object.hasOwn(QUEUE.get(hex), field));
            if (allFieldsPresent) {
              const data = { name, hex, ...QUEUE.get(hex) };
              SPM02V2Model.create(data);
              //Message cache using WebSocket service for update
              wsEventEmitter.emit("message", { ...data, time: new Date().toISOString() });
              //Clear cache
              QUEUE.delete(hex);
            }
            break;
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    mqttEventEmitter.on("command", (command) => {
      client.publish(`cmnd/${MQTT_TOPIC}/ZbSend`, JSON.stringify(command));
    });
  });
};

export { mqttClient };
