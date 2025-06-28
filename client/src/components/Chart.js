import React, { useState } from "react";
import { useGetPollingQuery } from "../api/polling-api-slice";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatTimeFunc } from "../functions";

const Chart = () => {
  const [history, setHistory] = useState(500);
  const { data, isFetching, isLoading } = useGetPollingQuery(history, { pollingInterval: 3000 });

  let pollingDataFormatted = {};
  if (!isLoading) {
    pollingDataFormatted = data.map((item) => ({
      ...item,
      time: formatTimeFunc(item.time),
    }));
  }

  const renderLineChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={pollingDataFormatted} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Tooltip />
        <Legend />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="energy" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="producedEnergy" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="power" stroke="#DC8B4B" dot={false} isAnimationActive={false} />

        <Line yAxisId="left" connectNulls type="monotone" dataKey="voltageX" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="currentX" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="powerX" stroke="#DC8B4B" dot={false} isAnimationActive={false} />

        <Line yAxisId="left" connectNulls type="monotone" dataKey="voltageY" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="currentY" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="powerY" stroke="#DC8B4B" dot={false} isAnimationActive={false} />

        <Line yAxisId="left" connectNulls type="monotone" dataKey="voltageZ" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="currentZ" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="powerZ" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
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
