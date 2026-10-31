import type {AppEvents} from './types';

type Handler<E, K extends keyof E> = (payload: E[K]) => void;
type Wildcard<E> = (name: keyof E, payload: E[keyof E]) => void;
export interface Subscription {
  remove(): void;
}
interface Emitter<E extends object> {
  all: Map<keyof E | '*', unknown[]>;
  on<K extends keyof E>(name: K, listener: Handler<E, K>): void;
  on(name: '*', listener: Wildcard<E>): void;
  off<K extends keyof E>(name: K | '*', listener?: Handler<E, K> | Wildcard<E>): void;
  emit<K extends keyof E>(
    name: K,
    ...payload: undefined extends E[K] ? [payload?: E[K]] : [payload: E[K]]
  ): void;
  addListener<K extends keyof E>(name: K, listener: Handler<E, K>): Subscription;
}

export default function createEmitter<E extends object = AppEvents>(): Emitter<E> {
  const listeners = new Map<keyof E | '*', unknown[]>();
  const on = (name: keyof E | '*', listener: unknown) => {
    const handlers = listeners.get(name) || [];
    handlers.push(listener);
    listeners.set(name, handlers);
  };
  const off = (name: keyof E | '*', listener?: unknown) => {
    if (!listener) listeners.delete(name);
    else {
      const handlers = listeners.get(name);
      const index = handlers?.indexOf(listener) ?? -1;
      if (index >= 0) handlers!.splice(index, 1);
    }
  };
  return {
    all: listeners,
    on,
    off,
    emit<K extends keyof E>(
      name: K,
      ...args: undefined extends E[K] ? [payload?: E[K]] : [payload: E[K]]
    ) {
      const payload = args[0] as E[K];
      listeners
        .get(name)
        ?.slice()
        .forEach((listener) => (listener as Handler<E, K>)(payload));
      listeners
        .get('*')
        ?.slice()
        .forEach((listener) => (listener as Wildcard<E>)(name, payload));
    },
    addListener(name, listener) {
      on(name, listener);
      return {remove: () => off(name, listener)};
    },
  };
}
export const emitter = createEmitter();
