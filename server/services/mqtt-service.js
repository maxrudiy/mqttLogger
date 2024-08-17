import NodeCache from "node-cache";
import mqtt from "mqtt";
import {
  Pj1203awInstantaneousModel,
  Pj1203awCumulativeModel,
} from "../models/pj1203aw-models.js";

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_TOPIC = process.env.MQTT_TOPIC;
const PJ1203AW = process.env.PJ1203AW;

const msgQueueInstantaneous = new NodeCache();
const msgQueueCumulative = new NodeCache();

const dpidsInstantaneousTable = {
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

const dpidsCumulativeTable = {
  forwardEnergyTotalA: "EF00/026A",
  reverseEnergyTotalA: "EF00/026B",
  forwardEnergyTotalB: "EF00/026C",
  reverseEnergyTotalB: "EF00/026D",
};

const dpidsInstantaneous = Object.values(dpidsInstantaneousTable);
const dpidsCumulative = Object.values(dpidsCumulativeTable);

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
        messageEventEmitter.emit("pj1203awMessage", pj1203awData);

        const dpid = Object.keys(pj1203awData).find((value) =>
          /EF00\/\d{2}[\d\w]{2}/.test(value)
        );

        if (dpidsInstantaneous.includes(dpid)) {
          if (msgQueueInstantaneous.has("EF00/0466")) {
            let dbData = {};
            for (let key of Object.keys(dpidsInstantaneousTable)) {
              dbData[key] = msgQueueInstantaneous.get(
                dpidsInstantaneousTable[key]
              );
            }
            Pj1203awInstantaneousModel.create(dbData);
            msgQueueInstantaneous.flushAll();
          }
          msgQueueInstantaneous.set(dpid, pj1203awData[dpid]);
        } else if (dpidsCumulative.includes(dpid)) {
          if (msgQueueCumulative.has("EF00/026A")) {
            let dbData = {};
            for (let key of Object.keys(dpidsCumulativeTable)) {
              dbData[key] = msgQueueCumulative.get(dpidsCumulativeTable[key]);
            }
            Pj1203awCumulativeModel.create(dbData);
            msgQueueCumulative.flushAll();
          }
          msgQueueCumulative.set(dpid, pj1203awData[dpid]);
        } else {
          console.log(pj1203awData);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
};

export { mqttClient };
