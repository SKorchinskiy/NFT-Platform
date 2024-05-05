"use client";

import { PropsWithChildren, createContext, useState } from "react";

export const PopupContext = createContext({
  text: "",
  updateText: (newText: string) => {},
});

export default function PopupProvider({ children }: PropsWithChildren) {
  const [text, setText] = useState("");

  const updateText = (newText: string) => setText(newText);

  return (
    <PopupContext.Provider
      value={{
        text,
        updateText,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
}
