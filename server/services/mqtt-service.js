import mqtt from "mqtt";
import { convertFunction, getFieldsByDataPoints } from "./functions.js";
import { devicesLibrary } from "./devices-library.js";
import { SPM02V2Model } from "../models/device-models.js";
import { wsEventEmitter, mqttEventEmitter } from "../events/events.js";

const SPM02V2Queue = new Map();

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
        const formattedMessage = convertFunction(received, devicesLibrary);
        switch (formattedMessage.model) {
          case "SPM02V2":
            // Save the field to cache
            SPM02V2Queue.set(formattedMessage.propertyName, formattedMessage.value);

            // Check if all required fields are present in cache and save it to database
            const REQUIRED_FIELDS = getFieldsByDataPoints(formattedMessage.model, devicesLibrary);
            const allFieldsPresent = REQUIRED_FIELDS.every((field) => SPM02V2Queue.has(field));
            if (allFieldsPresent) {
              const data = { model: formattedMessage.model, ...Object.fromEntries(SPM02V2Queue.entries()), time: new Date().toISOString() };
              SPM02V2Model.create(data);
              wsEventEmitter.emit("message", data); //Message cache using WebSocket service for update
              SPM02V2Queue.clear();
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
