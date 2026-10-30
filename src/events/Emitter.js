export default function createEmitter() {
  const listeners = new Map();
  return {
    all: listeners,
    on(name, listener) {
      const handlers = listeners.get(name) || [];
      handlers.push(listener);
      listeners.set(name, handlers);
    },
    off(name, listener) {
      if (!listener) listeners.delete(name);
      else {
        const handlers = listeners.get(name);
        const index = handlers?.indexOf(listener) ?? -1;
        if (index >= 0) handlers.splice(index, 1);
      }
    },
    emit(name, payload) {
      listeners.get(name)?.slice().forEach(listener => listener(payload));
      listeners.get('*')?.slice().forEach(listener => listener(name, payload));
    },
    addListener(name, listener) {
      this.on(name, listener);
      return {remove: () => this.off(name, listener)};
    },
  };
}

export const emitter = createEmitter();
