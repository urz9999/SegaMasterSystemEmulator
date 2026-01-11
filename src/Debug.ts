// Debug.ts
// Emulator debugging utilities for ROM header reading, register comparison, and browser logging

export class Debug {
    // Reads SMS ROM header and returns info
    static readRomHeader(buffer: Uint8Array) {
            // Scan for TMR SEGA signature
            const signature = [84, 77, 82, 32, 83, 69, 71]; // 'TMR SEGA'
            let headerOffset = -1;
            for (let i = 0; i < buffer.length - signature.length; i++) {
                let found = true;
                for (let j = 0; j < signature.length; j++) {
                    if (buffer[i + j] !== signature[j]) {
                        found = false;
                        break;
                    }
                }
                if (found) {
                    headerOffset = i;
                    break;
                }
            }
            if (headerOffset === -1) {
                console.warn('[Debug] TMR SEGA signature not found in ROM!');
                return { title: '', tmrSega: '', region: '', checksum: 0 };
            }
            // Extract header fields
            // Extract all possible SMS header fields
            const title = String.fromCharCode(...buffer.slice(headerOffset - 16, headerOffset)).replace(/\0/g, '').trim();
            const tmrSega = String.fromCharCode(...buffer.slice(headerOffset, headerOffset + 8));
            const regionByte = buffer[headerOffset + 8];
            const region = (regionByte & 0x80) ? 'Export' : 'Japan';
            const checksum = (buffer[headerOffset + 9] << 8) | buffer[headerOffset + 10];
            // Product code (2 bytes, BCD, optional)
            const productCode = ((buffer[headerOffset + 11] << 8) | buffer[headerOffset + 12]).toString(16).padStart(4, '0');
            // Version (1 byte, optional)
            const version = buffer[headerOffset + 13];
            // ROM size (1 byte, optional, in 16KB units)
            const size = buffer[headerOffset + 14] * 16;
            // Reserved/unused (headerOffset + 15)
            const reserved = buffer[headerOffset + 15];
            // Copyright (headerOffset + 16 to +23, sometimes present)
            const copyright = String.fromCharCode(...buffer.slice(headerOffset + 16, headerOffset + 24)).replace(/\0/g, '').trim();
            // Country code (headerOffset + 24, sometimes present)
            const countryCode = buffer[headerOffset + 24];
            // Hex dump of header for debugging
            const hexHeader = Array.from(buffer.slice(headerOffset - 16, headerOffset + 32)).map(b => b.toString(16).padStart(2, '0')).join(' ');
            // Raw header bytes for debugging
            const rawHeader = Array.from(buffer.slice(headerOffset - 16, headerOffset + 32));
            return {
                title,
                tmrSega,
                region,
                checksum,
                productCode,
                version,
                sizeKB: size,
                reserved,
                copyright,
                countryCode,
                rawHeader,
                hexHeader
            };
    }

    // Compares two Z80 register sets and returns array of differences
    static compareRegisters(regA: Record<string, number>, regB: Record<string, number>): string[] {
        const diffs: string[] = [];
        for (const key in regA) {
            if (regA[key] !== regB[key]) {
                diffs.push(`${key}: ${regA[key]} !== ${regB[key]}`);
            }
        }
        return diffs;
    }

    // Logs info to browser console
    static logInfo(msg: string, ...args: any[]) {
        console.info(`[Emu][INFO] ${msg}`, ...args);
    }

    // Logs warning to browser console
    static logWarn(msg: string, ...args: any[]) {
        console.warn(`[Emu][WARN] ${msg}`, ...args);
    }

    // Logs error to browser console
    static logError(msg: string, ...args: any[]) {
        console.error(`[Emu][ERROR] ${msg}`, ...args);
    }
}
