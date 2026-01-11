// biosDebugTest.ts
// Test for Z80 BIOS loading and initialization

import Z80 from '../src/Z80';
import * as path from 'path';
import * as fs from 'fs';

function printBiosInfo(biosPath: string, biosData: Uint8Array) {
    console.info(`[Test] BIOS file: ${biosPath}`);
    console.info(`[Test] BIOS size: ${biosData.length} bytes`);
    // Print first 10 lines of ASM for user context
    const biosText = Buffer.from(biosData).toString('utf8');
    const lines = biosText.split(/\r?\n/).slice(0, 10);
    console.info('[Test] BIOS first 10 lines:');
    lines.forEach((line, i) => console.info(`  ${i + 1}: ${line}`));
    // Print hex dump of first 32 bytes
    const hexDump = Array.from(biosData.slice(0, 32)).map(b => b.toString(16).padStart(2, '0')).join(' ');
    console.info(`[Test] BIOS first 32 bytes (hex): ${hexDump}`);
}

function testBiosLoading() {
    const biosPath = path.join(__dirname, '../dist/Bios13.asm');
    if (fs.existsSync(biosPath)) {
        const z80 = new Z80();
        if (z80.biosData) {
            console.info('[Test] BIOS loaded successfully.');
            printBiosInfo(biosPath, z80.biosData);
            z80.initializeFromBios();
        } else {
            console.error('[Test] BIOS data not loaded.');
        }
    } else {
        console.warn('[Test] BIOS file not found in dist folder.');
    }
}

testBiosLoading();
