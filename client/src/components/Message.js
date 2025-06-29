import React from "react";
import { useSelector } from "react-redux";

const Message = () => {
  const latestMessage = useSelector((state) => state.latestMessage.message);

  return latestMessage ? (
    <div>
      Модель Лічильника: {latestMessage.model}
      <br />
      Спожито електроенергії: {latestMessage.energy} кВт*год
      <br />
      Згенеровано електроенергії: {latestMessage.producedEnergy} кВт*год
      <br />
      Коефіцієнт потужності: {latestMessage.powerFactor}
      <br />
      Частота: {latestMessage.acFrequency} Гц
      <br />
      Напруга X:{latestMessage.voltageX} В
      <br />
      Струм X: {latestMessage.currentX} А
      <br />
      Потужність X: {latestMessage.powerX} Вт
      <br />
      Напруга Y: {latestMessage.voltageY} В
      <br />
      Струм Y: {latestMessage.currentY} А
      <br />
      Потужність Y: {latestMessage.powerY} Вт
      <br />
      Напруга Z: {latestMessage.voltageZ} В
      <br />
      Струм Z: {latestMessage.currentZ} А
      <br />
      Потужність Z: {latestMessage.powerZ} Вт
      <br />
      Загальна потужність: {latestMessage.power} Вт
      <br />
    </div>
  ) : (
    "isLoading"
  );
};

export { Message };
