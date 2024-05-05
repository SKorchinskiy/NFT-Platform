"use client";

import { PopupContext } from "@/app/providers/popup.provider";
import { useContext, useEffect, useState } from "react";

export default function ActionPopup() {
  const [isVisible, setIsVisible] = useState(false);

  const { text } = useContext(PopupContext);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  }, [text]);

  return (
    <div
      style={{
        display: isVisible ? "block" : "none",
        position: "absolute",
        right: 50,
        bottom: 50,
        background: "rgba(179, 225, 172, 0.8)",
        paddingLeft: 100,
        paddingRight: 100,
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 5,
        boxShadow: "10px 5px 10px rgba(0, 0, 0, 0.5)",
        fontFamily: "monospace",
        textTransform: "uppercase",
        color: "black",
      }}
    >
      {text}
    </div>
  );
}
