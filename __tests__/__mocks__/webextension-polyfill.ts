type Listener = (...args: any[]) => void;

const messageListeners = new Set<Listener>();

const browserStub = {
  runtime: {
    sendMessage: async (..._args: any[]) => undefined,
    getURL: (path: string) => path,
    onMessage: {
      addListener(listener: Listener) {
        messageListeners.add(listener);
      },
      removeListener(listener: Listener) {
        messageListeners.delete(listener);
      },
      hasListener(listener: Listener) {
        return messageListeners.has(listener);
      },
      _dispatch(...args: any[]) {
        messageListeners.forEach((listener) => listener(...args));
      },
    },
  },
  storage: {
    local: {
      get: async () => ({} as Record<string, unknown>),
      set: async () => undefined,
      remove: async () => undefined,
      clear: async () => undefined,
    },
    sync: {
      get: async () => ({} as Record<string, unknown>),
      set: async () => undefined,
    },
  },
  tabs: {
    query: async () => [],
    sendMessage: async (..._args: any[]) => undefined,
  },
  i18n: {
    getMessage: (_key: string, defaultValue?: string) => defaultValue ?? "",
  },
};

export const browser = browserStub;
export default browserStub;
