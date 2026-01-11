// romDebugTest.ts
// Simple test for Debug class ROM header reading

const { Debug } = require('../src/Debug');

// Helper to load ROM file as Uint8Array (Node.js)
import * as fs from 'fs';
import * as path from 'path';

function testRomHeader(romPath: string) {
    // Always read as binary Buffer
    const buffer = fs.readFileSync(romPath, null); // null encoding returns Buffer
    const romData = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const header = Debug.readRomHeader(romData);
    Debug.logInfo(`ROM Header for ${path.basename(romPath)}:`, header);
    if (header.tmrSega.includes('TMR SEGA')) {
        Debug.logInfo('TMR SEGA signature found.');
    } else {
        Debug.logWarn('TMR SEGA signature NOT found!');
    }
    Debug.logInfo(`Region: ${header.region}, Checksum: ${header.checksum}`);
}

function runTests() {
    const romsDir = path.join(__dirname, '../ROMS');
    const romFiles = fs.readdirSync(romsDir);
    romFiles.forEach(file => {
        const romPath = path.join(romsDir, file);
        if (fs.existsSync(romPath)) {
            testRomHeader(romPath);
        } else {
            Debug.logError(`ROM file not found: ${romPath}`);
        }
    });
}

runTests();
