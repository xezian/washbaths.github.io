import "./app.css";
import App from "./App.svelte";

export interface IEvents {
  title: string;
  date: Date;
  text: string[];
}

const app = new App({
  target: document.getElementById("app"),
});

export default app;
