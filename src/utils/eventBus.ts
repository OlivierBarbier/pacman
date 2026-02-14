type EventHandler = (payload?: any) => void;

class EventBus {
  private listeners: { [key: string]: EventHandler[] } = {};

  on(event: string, handler: EventHandler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  emit(event: string, payload?: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(handler => handler(payload));
  }
}

export const gameEventBus = new EventBus();
