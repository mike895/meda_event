import React from "react";
import { useTimer } from "react-timer-hook";
interface Props {
  expiryTimestamp: Date;
  onExpire: Function;
}
export default function EnterOTP({ expiryTimestamp, onExpire }: Props) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => onExpire() });
  return (
    <div>
      <span>{minutes}</span>:<span>{seconds}</span>
    </div>
  );
}
