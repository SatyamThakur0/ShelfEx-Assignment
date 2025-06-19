import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import store from "./store/store";
import { SocketProvider } from "./store/SocketContext";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <SocketProvider>
            <App />
            <Toaster />
        </SocketProvider>
    </Provider>
);
