import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ISOTimeStringToLocaleTimeString } from "../services/functions";

const Chart = (props) => {
  const renderLineChart = (data) => {
    let dataDateFormatted = {};
    dataDateFormatted = data.map((item) => ({
      ...item,
      time: ISOTimeStringToLocaleTimeString(item.time),
    }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataDateFormatted} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
  };

  return <>{!props.isLoading ? renderLineChart(props.data) : "Loading"}</>;
};

export default Chart;
