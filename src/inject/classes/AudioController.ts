import Audiohacker from "audio-hacker";
import { on } from "events";
import debounce from "lodash-es/debounce";
import { ActionType, IRollConfig } from "src/types/type.d";
import { sendRuntimeMessage } from "src/util";

export type Context = {
  type: "stream" | "element";
  streamId?: string;
  el?: HTMLVideoElement;
};

export default class AudioController {
  audioHacker: Audiohacker | null = null;

  audioCtx: AudioContext | null = null;

  errorEvents: Function[] = [];

  rollConfig: IRollConfig;

  context: Context | undefined;

  tabId: string | number = "";

  private corsZeroMonitorTimer: number | null = null;
  private analyser: AnalyserNode | null = null;
  private elementSourceNode: MediaElementAudioSourceNode | null = null;

  constructor(
    context: Context,
    tabId: number | string,
    rollConfig: IRollConfig,
    onError: Function
  ) {
    this.context = context;
    this.tabId = tabId ?? "";
    this.rollConfig = rollConfig;
    if (typeof onError === "function") {
      this.onError(onError);
    }

    this.setup();
  }
}
