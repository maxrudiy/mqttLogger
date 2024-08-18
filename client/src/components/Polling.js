import React from "react";
import { useGetPollingQuery } from "../api/polling-api-slice";

const formatTimeFunc = (time) => new Date(time).toLocaleTimeString("uk", { timeZone: "Europe/Kyiv" });

const Polling = () => {
  const { data, isFetching, isLoading } = useGetPollingQuery(undefined, {
    pollingInterval: 1000,
  });

  return data ? (
    <div>
      {data["dataInst"].map((value, index) => (
        <div key={index}>
          L1:{value.currentA / 1000}A, &emsp; P1=
          {Math.round(((Math.sqrt(3) * value.currentA) / 1000) * 380 * 10) / 10000}
          кВт &emsp; L2:{value.currentB / 1000}A, &emsp; P2=
          {Math.round(((Math.sqrt(3) * value.currentB) / 1000) * 380 * 10) / 10000}
          кВт &emsp; {formatTimeFunc(value.time)}
        </div>
      ))}
    </div>
  ) : (
    isLoading
  );
};

export { Polling };
