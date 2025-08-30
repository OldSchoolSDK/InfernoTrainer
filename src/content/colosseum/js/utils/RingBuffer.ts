export class RingBuffer {
    private length = 0;
    private head = 0;
    private buffer: boolean[];

    constructor(size: number) {
        this.buffer = new Array(size).fill(false);
    }

    push(value: boolean) {
        this.buffer[this.head] = value;
        this.head = (this.head + 1) % this.buffer.length;
        if (this.length < this.buffer.length) {
            this.length++;
        }
    }

    pop() {
        if (this.length === 0) {
            return false;
        }
        this.head = (this.head - 1 + this.buffer.length) % this.buffer.length;
        this.length--;
        return this.buffer[this.head];
    }

    clear() {
        this.length = 0;
    }
}