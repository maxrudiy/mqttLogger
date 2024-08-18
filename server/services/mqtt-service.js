import NodeCache from "node-cache";
import mqtt from "mqtt";
import { Pj1203awInstModel, Pj1203awTotalModel } from "../models/pj1203aw-models.js";

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_TOPIC = process.env.MQTT_TOPIC;
const PJ1203AW = process.env.PJ1203AW;

const queueInst = new NodeCache();
const queueTotal = new NodeCache();

const idsInstTable = {
  powerTotal: "EF00/0273",
  powerA: "EF00/0265",
  powerB: "EF00/0269",
  powerDirectionA: "EF00/0466",
  powerDirectionB: "EF00/0468",
  powerFactorA: "EF00/026E",
  powerFactorB: "EF00/0279",
  powerFreq: "EF00/026F",
  voltage: "EF00/0270",
  currentA: "EF00/0271",
  currentB: "EF00/0272",
};

const idsTotalTable = {
  forwardEnergyTotalA: "EF00/026A",
  reverseEnergyTotalA: "EF00/026B",
  forwardEnergyTotalB: "EF00/026C",
  reverseEnergyTotalB: "EF00/026D",
};

const formattedMessageFunc = (id, value, table) => {
  const formattedMessage = {};
  const propertyName = Object.entries(table).find((item) => item.includes(id))[0];
  formattedMessage[propertyName] = value;
  return formattedMessage;
};

const idsInst = Object.values(idsInstTable);
const idsTotal = Object.values(idsTotalTable);

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
        const received = JSON.parse(message.toString());
        const pj1203awData = received.ZbReceived[PJ1203AW];

        const id = Object.keys(pj1203awData).find((value) => /EF00\/\d{2}[\d\w]{2}/.test(value));
        if (idsInst.includes(id)) {
          const formattedMessage = formattedMessageFunc(id, pj1203awData[id], idsInstTable);
          messageEventEmitter.emit("pj1203awMessage", formattedMessage);

          if (queueInst.has("powerDirectionA")) {
            Pj1203awInstModel.create(queueInst.mget(queueInst.keys()));
            queueInst.flushAll();
          }
          queueInst.set(Object.getOwnPropertyNames(formattedMessage)[0], pj1203awData[id]);
        } else if (idsTotal.includes(id)) {
          const formattedMessage = formattedMessageFunc(id, pj1203awData[id], idsTotalTable);
          messageEventEmitter.emit("pj1203awMessage", formattedMessage);
          if (queueTotal.has("forwardEnergyTotalA")) {
            Pj1203awTotalModel.create(queueTotal.mget(queueTotal.keys()));
            queueTotal.flushAll();
          }
          queueTotal.set(Object.getOwnPropertyNames(formattedMessage)[0], pj1203awData[id]);
        } else {
          console.log(pj1203awData);
        }
      } catch (err) {
        console.log(err.message);
      }
    });
  });
};

export { mqttClient };
