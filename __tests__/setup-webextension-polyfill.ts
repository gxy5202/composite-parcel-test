import browserStub from "./__mocks__/webextension-polyfill";

declare global {
  // eslint-disable-next-line no-var
  var browser: typeof browserStub;
}

if (typeof globalThis.chrome === "undefined") {
  // Minimal Chrome extension runtime shim to keep webextension-polyfill from throwing.
  globalThis.chrome = {
    runtime: {},
  } as unknown as typeof chrome;
}

globalThis.chrome.runtime ??= {} as typeof chrome.runtime;
globalThis.chrome.runtime.id ??= "test-extension";
globalThis.chrome.runtime.sendMessage ??= (() => Promise.resolve()) as typeof chrome.runtime.sendMessage;

const onMessage = globalThis.chrome.runtime.onMessage ?? {
  addListener: () => undefined,
  removeListener: () => undefined,
  hasListener: () => false,
};

globalThis.chrome.runtime.onMessage = onMessage as typeof chrome.runtime.onMessage;

if (typeof globalThis.browser === "undefined") {
  globalThis.browser = browserStub;
}
