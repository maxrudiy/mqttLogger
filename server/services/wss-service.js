import { WebSocketServer } from "ws";
import { wsEventEmitter } from "../events/events.js";

const WSS_PORT = process.env.WSS_PORT || 8081;

const wsServer = () => {
  const wss = new WebSocketServer({ port: WSS_PORT });

  wss.on("connection", (ws) => {
    ws.on("error", (err) => console.log(err));

    ws.on("message", (data) => {
      console.log(`Ws received: ${data}`);
    });

    wsEventEmitter.on("SPM02V2", (value) => {
      ws.send(JSON.stringify(value));
    });
  });
};

export { wsServer };
