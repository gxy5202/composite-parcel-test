import { createApp } from "vue";
import "@vant/touch-emulator";
import "vant/lib/index.css";
import "./global.css";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";

import { vPermission } from "./directive";

import Vant from 'vant';

export function createVideoRollApp(app: any, selector: string) {
  createApp(app)
    .use(Vant)
    .use(FloatingVue)
    .directive("permission", vPermission)
    .mount(selector);
}
