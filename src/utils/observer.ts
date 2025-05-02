export class Observer<T extends (...args: any) => void> { 
  private callbacks: T[] = [];

  public subscribe(callback: T): void {
    this.callbacks.push(callback);
  }

  public notify(...data: Parameters<T>): void {
    this.callbacks.forEach(callback => callback(...data));
  }

  public unsubscribe(callback: T): void {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }
}