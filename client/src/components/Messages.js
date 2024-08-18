import React from "react";
import { useGetMessagesQuery } from "../api/messages-api-slice";

const Messages = () => {
  const { data, isFetching, isLoading } = useGetMessagesQuery();

  return data ? (
    <div>
      powerTotal: {data.powerTotal}, powerA: {data.powerA}, powerB: {data.powerB}, powerDirectionA: {data.powerDirectionA}, powerDirectionB:
      {data.powerDirectionB}, powerFactorA: {data.powerFactorA}, powerFactorB: {data.powerFactorB}, powerFreq: {data.powerFreq}, voltage: {data.voltage},
      currentA: {data.currentA}, currentB: {data.currentB}, forwardEnergyTotalA: {data.forwardEnergyTotalA}, reverseEnergyTotalA: {data.reverseEnergyTotalA},
      forwardEnergyTotalB: {data.forwardEnergyTotalB}, reverseEnergyTotalB: {data.reverseEnergyTotalB},
    </div>
  ) : (
    isLoading
  );
};

export { Messages };
