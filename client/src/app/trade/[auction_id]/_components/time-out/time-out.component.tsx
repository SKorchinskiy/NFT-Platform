"use client";

import styles from "./time-out.module.css";
import { useEffect, useRef, useState } from "react";

const TIME_CONV = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
};

export default function TimeOut({ end_time }: { end_time: number }) {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(end_time - Math.floor(Date.now()), 0)
  );
  const tid = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!tid.current) {
      tid.current = setInterval(
        () => setTimeLeft((prevTime) => prevTime - 1000),
        1000
      );
    } else if (timeLeft === 0) {
      clearTimeout(tid.current);
    }
  }, [timeLeft, end_time]);

  const timeFormatter = (value: number) => {
    if (Math.floor(value) < 10) {
      return `0${Math.floor(value)}`;
    }
    return Math.floor(value).toString();
  };

  return (
    <div className={styles["time-out-outer-container"]}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className={styles["time-outer-container"]}>
          {Array.from(timeFormatter(timeLeft / TIME_CONV.day)).map(
            (value: string, index: number) => (
              <div key={index} className={styles["time-container"]}>
                {value}
              </div>
            )
          )}
        </div>
        <div className={styles["time-outer-container"]}>
          {Array.from(
            timeFormatter((timeLeft % TIME_CONV.day) / TIME_CONV.hour)
          ).map((value: string, index: number) => (
            <div key={index} className={styles["time-container"]}>
              {value}
            </div>
          ))}
        </div>
        <div className={styles["time-outer-container"]}>
          {Array.from(
            timeFormatter((timeLeft % TIME_CONV.hour) / TIME_CONV.minute)
          ).map((value: string, index: number) => (
            <div key={index} className={styles["time-container"]}>
              {value}
            </div>
          ))}
        </div>
        <div className={styles["time-outer-container"]}>
          {Array.from(
            timeFormatter((timeLeft % TIME_CONV.minute) / TIME_CONV.second)
          ).map((value: string, index: number) => (
            <div key={index} className={styles["time-container"]}>
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
