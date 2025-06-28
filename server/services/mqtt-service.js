import NodeCache from "node-cache";
import mqtt from "mqtt";
import { convertFunction } from "./functions.js";
import { devicesLibrary } from "./devices-library.js";
import { SPM02V2Model } from "../models/devices-models.js";

const queue = new NodeCache();

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_TOPIC = process.env.MQTT_TOPIC;

const mqttClient = (messageEventEmitter) => {
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

    client.subscribe(MQTT_TOPIC, () => {
      console.log(`Subscribed to topic`);
    });

    client.on("message", (topic, message) => {
      try {
        const received = JSON.parse(message.toString()).ZbReceived;
        const formattedMessage = convertFunction(received, devicesLibrary);
        switch (formattedMessage.model) {
          case "SPM02V2":
            messageEventEmitter.emit("message", formattedMessage);
            if (queue.has("power")) {
              SPM02V2Model.create({ ...queue.mget(queue.keys()), model: formattedMessage.model });
              queue.flushAll();
            }
            queue.set(formattedMessage.propertyName, formattedMessage.value);
            break;
        }
      } catch (err) {
        console.log(err.message);
      }
    });
  });
};

export { mqttClient };
