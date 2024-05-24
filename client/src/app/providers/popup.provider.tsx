"use client";

import { PropsWithChildren, createContext, useState } from "react";

export const PopupContext = createContext({
  params: {
    text: "",
    color: "",
  },
  updatePopup: (newText: string, newColor: string) => {},
});

export default function PopupProvider({ children }: PropsWithChildren) {
  const [params, setParams] = useState({
    text: "",
    color: "",
  });

  const updatePopup = (newText: string, newColor: string) => {
    setParams({ text: newText, color: newColor });
  };

  return (
    <PopupContext.Provider
      value={{
        params,
        updatePopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
}
