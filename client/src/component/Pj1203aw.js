import React from "react";
import { useGetPj1203awDataQuery } from "../api/dashboard-api-slice";

const _ = undefined;

const Pj1203aw = () => {
  const { data, isFetching, isLoading } = useGetPj1203awDataQuery(_, {
    pollingInterval: 1000,
  });

  const formatTimeFunc = (time) =>
    new Date(time).toLocaleTimeString("uk", { timeZone: "Europe/Kyiv" });

  return data ? (
    <div>
      Збережено у базу даних:
      {data["dataInstantaneous"].map((value, index) => (
        <div key={index}>
          L1:{value.currentA / 1000}A, &emsp; P1=
          {Math.round(((Math.sqrt(3) * value.currentA) / 1000) * 380 * 10) /
            10000}
          кВт &emsp; L2:{value.currentB / 1000}A, &emsp; P2=
          {Math.round(((Math.sqrt(3) * value.currentB) / 1000) * 380 * 10) /
            10000}
          кВт &emsp; {formatTimeFunc(value.time)}
        </div>
      ))}
    </div>
  ) : (
    isLoading
  );
};

export default Pj1203aw;
