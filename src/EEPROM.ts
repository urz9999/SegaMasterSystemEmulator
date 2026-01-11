// EEPROM.ts
// Sega Master System EEPROM emulation (for supported mappers)

export class EEPROM {
    constructor(size: number = 0x200) {
        this.data = new Uint8Array(size);
        this.size = size;
    }

    data: Uint8Array;
    size: number;

    read(address: number): number {
        return this.data[address % this.size];
    }

    write(address: number, value: number): void {
        this.data[address % this.size] = value & 0xFF;
    }

    load(buffer: Uint8Array): void {
        this.data.set(buffer.subarray(0, this.size));
    }

    save(): Uint8Array {
        return this.data.slice();
    }
}
