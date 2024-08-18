import { WebSocketServer } from "ws";

const WSS_PORT = process.env.WSS_PORT || 8081;

const wsServer = (messageEventEmitter) => {
  const wss = new WebSocketServer({ port: WSS_PORT });

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
