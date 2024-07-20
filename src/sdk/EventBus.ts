export class EventBus {
    private subscribers: { [eventName: string]: ((event: any) => void)[] } = {};
  
    subscribe(eventName: string, handler: (event: any) => void) {
      if (!this.subscribers[eventName]) {
        this.subscribers[eventName] = [];
      }
      this.subscribers[eventName].push(handler);
    }
  
    publish(event: any) {
      const eventName = event.constructor.name; // Get the event name from the class
      const handlers = this.subscribers[eventName];
      if (handlers) {
        handlers.forEach(handler => handler(event));
      }
    }
  }