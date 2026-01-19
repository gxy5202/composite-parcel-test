/*
 * @description: popup entry
 * @Author: Gouxinyu
 * @Date: 2022-01-13 19:43:08
 */
import { createVideoRollApp } from '../../lib/share';
import App from "./App";
// popup.js
import composite from "@composite-inc/composite-js";

document.addEventListener("DOMContentLoaded", async () => {
  await composite.init({
    apiKey: "pk_9_a082420259994995",
    apiHost: 'https://prod.alb.us.api.composite.com'
  });


  // Identify user when they log in
  document.addEventListener("click", async () => {
    console.log("click");
    composite.identify("test_user", {
      email: "test@example.com",
    });
  });
});

createVideoRollApp(App, '#app')
