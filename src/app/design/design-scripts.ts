let loaded = false;

type Held = { target: EventTarget; type: string; listener: EventListenerOrEventListenerObject };

/** Loads the uploaded page's own scripts, unchanged, once the converted markup is on the page. */
export function loadDesignScripts(urls: string[]): void {
  if (loaded || !urls.length) return;
  loaded = true;
  const held: Held[] = [];
  const onload = Object.getOwnPropertyDescriptor(window, 'onload');
  const restore: Array<() => void> = [];
  [document, window].forEach((target) => {
    const original = target.addEventListener.bind(target) as unknown as (type: string, listener: unknown, options?: unknown) => void;
    (target as { addEventListener: unknown }).addEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: unknown) => {
      if ((type === 'DOMContentLoaded' || type === 'load') && listener) held.push({ target, type, listener });
      else original(type, listener, options);
    };
    restore.push(() => delete (target as { addEventListener?: unknown }).addEventListener);
  });
  let assigned: EventListener | null = null;
  Object.defineProperty(window, 'onload', { configurable: true, get: () => assigned, set: (fn) => { assigned = typeof fn === 'function' ? fn : null; } });
  restore.push(() => {
    delete (window as { onload?: unknown }).onload;
    if (onload) Object.defineProperty(window, 'onload', onload);
  });
  const finish = () => {
    restore.forEach((undo) => undo());
    const fire = (target: EventTarget, type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (!listener) return;
      try {
        const event = new Event(type);
        if (typeof listener === 'function') listener.call(target, event);
        else listener.handleEvent(event);
      } catch (error) {
        console.error(error);
      }
    };
    held.forEach(({ target, type, listener }) => fire(target, type, listener));
    fire(window, 'load', assigned);
  };
  let pending = urls.length;
  const done = () => {
    pending -= 1;
    if (pending === 0) finish();
  };
  urls.forEach((url) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = false;
    script.onload = done;
    script.onerror = done;
    document.body.appendChild(script);
  });
}
