import { WebSocketServer } from "ws";

const WS_PORT = process.env.WS_PORT || 8081;

const wsServer = (messageEventEmitter) => {
  const wss = new WebSocketServer({ port: WS_PORT });

  wss.on("connection", (ws) => {
    ws.on("error", (err) => console.log(err));

    ws.on("message", (data) => {
      console.log(`Ws received: ${data}`);
    });

    messageEventEmitter.on("pj1203awMessage", (value) => {
      ws.send(JSON.stringify(value));
    });
  });
};

export { wsServer };
