"use client";

import styles from "./action-popup.module.css";
import { useContext, useEffect, useState } from "react";

import { PopupContext } from "@/app/providers/popup.provider";

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
      className={styles["popup-container"]}
      style={{ display: isVisible ? "block" : "none" }}
    >
      {text}
    </div>
  );
}
