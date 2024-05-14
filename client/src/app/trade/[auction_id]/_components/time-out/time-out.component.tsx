"use client";

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

  console.log({ end_time, now: Math.floor(Date.now()) });

  useEffect(() => {
    if (!tid.current) {
      tid.current = setInterval(
        () => setTimeLeft((prevTime) => prevTime - 1000),
        1000
      );
      console.log({ timeLeft });
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
    <div
      style={{
        width: 400,
        marginTop: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 5,
          }}
        >
          {Array.from(timeFormatter(timeLeft / TIME_CONV.day)).map(
            (value: string, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 70,
                  width: 40,
                  background: "black",
                  color: "white",
                }}
              >
                {value}
              </div>
            )
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 5,
          }}
        >
          {Array.from(
            timeFormatter((timeLeft % TIME_CONV.day) / TIME_CONV.hour)
          ).map((value: string, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 70,
                width: 40,
                background: "black",
                color: "white",
              }}
            >
              {value}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 5,
          }}
        >
          {Array.from(
            timeFormatter((timeLeft % TIME_CONV.hour) / TIME_CONV.minute)
          ).map((value: string, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 70,
                width: 40,
                background: "black",
                color: "white",
              }}
            >
              {value}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 5,
          }}
        >
          {Array.from(
            timeFormatter((timeLeft % TIME_CONV.minute) / TIME_CONV.second)
          ).map((value: string, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 70,
                width: 40,
                background: "black",
                color: "white",
              }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
