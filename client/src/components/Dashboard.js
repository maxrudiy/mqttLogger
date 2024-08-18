import React from "react";
import { Polling } from "./Polling";
import { Messages } from "./Messages";

const Dashboard = () => {
  return (
    <>
      <Messages />
      <Polling />
    </>
  );
};

export { Dashboard };
