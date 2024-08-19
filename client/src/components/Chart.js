import React, { useState } from "react";
import { useGetPollingQuery } from "../api/polling-api-slice";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatTimeFunc, toActivePower3ph, toApparentPower3ph } from "../functions";

const Chart = () => {
  const [history, setHistory] = useState(500);
  const { data, isFetching, isLoading } = useGetPollingQuery(history, { pollingInterval: 3000 });

  let pollingDataFormatted = { currentA: 0, currentB: 0, apparentPower3phB: 0, apparentPower3phA: 0, time: 0 };
  if (!isLoading) {
    pollingDataFormatted = data.dataInst.map((item) => ({
      ...item,
      apparentPower3phB: toApparentPower3ph(item.currentB, 380),
      time: formatTimeFunc(item.time),
    }));
    console.log(pollingDataFormatted);
  }

  const renderLineChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={pollingDataFormatted} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Tooltip />
        <Legend />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="currentB" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="right" connectNulls type="monotone" dataKey="apparentPower3phB" stroke="#4b9cdc" dot={false} isAnimationActive={false} />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="time" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <input type="text" onChange={(event) => setHistory(event.target.value)} defaultValue={history} />
      {renderLineChart}
    </>
  );
};

export { Chart };
