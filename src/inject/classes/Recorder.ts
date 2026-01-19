import { saveAs } from "file-saver";
import { formatTime } from "src/popup/content/utils";
import { sendRuntimeMessage } from "src/util";

export default class Record {
  mediaRecorder: any = null;
  _recordedChunks: any[] = [];
  _startRecordTime = 0;
  private recordButton: HTMLElement | null = null;
  private stopRecordCallback: Function | null = null;

  constructor() {
    // this.addElement(video);
  }
}
