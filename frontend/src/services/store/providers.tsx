"use client";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./store";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
}
