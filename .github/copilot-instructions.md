# Copilot Instructions
#
# Project Initialization Log
#
# The following actions were performed to set up the project:
# 1. Initialized a Vite project with TypeScript using pnpm as the package manager.
# 2. Created a .gitignore file to exclude node_modules, dist, rom, and other common folders.
# 3. Added a copilot-instructions.md file for session tracking and instructions.
# 4. Installed and configured SCSS support (sass) for Vite.
# 5. Created a src folder with main.ts and main.scss for entry code and styles.
# 6. Added Google Fonts (Roboto) to both HTML and SCSS for consistent typography.
# 7. Created a single index.html file as the project entry point.
# 8. Configured vite.config.ts for SCSS, alias, and dist output.
# 9. Updated package.json with Vite scripts (dev, build, preview) and metadata.
# 10. Upgraded Node.js to v22.12.0 for Vite 7 compatibility.
# 11. Ran pnpm run build to generate minified JS and CSS in the dist folder.

This file tracks workspace-specific instructions and session data for Copilot. Follow the checklist below to ensure consistent project setup and workflow continuity.

## Project Setup Checklist

- [ ] Clarify Project Requirements
- [ ] Scaffold the Project
- [ ] Customize the Project
- [ ] Install Required Extensions
- [ ] Compile the Project
- [ ] Create and Run Task
- [ ] Launch the Project
- [ ] Ensure Documentation is Complete

## Session Data

- Record any session-specific notes, decisions, or context here for future reference.
- Update this file whenever you close or restart a session.

---

# Sega Master System Emulator Context
## General Overview
Reference: Rodrigo Copetti, "Sega Master System Architecture" (https://www.copetti.org/writings/consoles/master-system/)

This section summarizes the Sega Master System hardware for emulator development. Supplement with more technical sources as needed.

## CPU

## Memory

## Technical Reference Expansion

### Memory Map
- $0000-$bfff: Cartridge ROM/RAM/expansion
- $c000-$dfff: System RAM
- $e000-$ffff: System RAM (mirror)
- $fff8-$fffb: 3D glasses control
- $fffc-$ffff: Mapper control registers

### Z80 Registers
- 8-bit: A, F, B, C, D, E, H, L, A', F', B', C', D', E', H', L'
- 16-bit: IX, IY, SP, PC
- Special: I (Interrupt Vector), R (Refresh), shadow registers (apostrophe)

### SN76489 Sound Chip
- 4 channels: 3 tone, 1 noise
- Registers: 4x4-bit volume, 3x10-bit tone, 1x3-bit noise
- Access: I/O ports 0x40-0x7f (usually 0x7f)
- Volume: 2dB attenuation per step, 0x0 full, 0xf silent
- Noise: LFSR, white/periodic modes, feedback taps (bits 0/3)
- PCM sample playback via rapid volume changes

### Pause Button
- Hardware pause triggers Z80 NMI, jumps to $0066
- Games set RAM flag, return from interrupt

### VDP (Video Display Processor)
- Reference: TMS9918A/TMS9928A/TMS9929A Data Manual (see attached PDF)
- 16 KB VRAM, tile/sprite/background layers, CRAM for palettes
- Access via I/O ports, registers for graphics control

### Service Manual & Schematics
- See SMS Power! Service Manual for troubleshooting, parts, and schematics
- Useful for hardware-level emulation and edge cases

- Video Display Processor (VDP), based on TI TMS9918
- 256x192 px standard resolution (other modes: 256x224, 256x240)
- 4 modes (Mode IV is native, tile-based)
- VRAM: 16 KB, 14 KB for tiles (448 tiles max, 8x8 px, 4 bits per pixel)
- Colour RAM (CRAM): 2 palettes of 16 colours, 6 bits per entry (64 colours)
- Sprite/background layers, collision detection via status register

## Audio
- Texas Instruments SN76489 PSG (Programmable Sound Generator)
- 3 pulse channels, 1 noise channel
- Japanese SMS: Yamaha YM2413 FM chip (9 channels, 16 preset/custom instruments)
- PSG/FM accessed via I/O ports

## I/O
- 2 controller ports
- Cartridge slot, Sega Card slot, expansion slot
- I/O controller chip for joypads, FM expansion, system enable/disable
- PAUSE button (non-maskable interrupt), RESET button (controller keypress)

## Operating System / Boot
- 8 KB BIOS ROM (boot manager, not OS)
- Boot order: Sega Card > Cartridge > Expansion
- Region check via ROM header (TMR SEGA)
- Japanese SMS: SG-1000 compatibility, integrity check

## Games & Media
- Cartridges: up to 48 KB, mappers for up to 512 KB
- Sega Cards: up to 32 KB, no mappers
- Games written in Z80 assembly

## Anti-Piracy & Region Locking
- Region lock via cartridge slot shape and ROM header

## Sources for Further Technical Detail
- smspower.org (memory map, registers, hardware manuals)
- Texas Instruments datasheets (SN76489, TMS9918)
- Sega hardware reference manuals


---

## MEKA Emulator Implementation Insights

### Z80 CPU Emulation (z80marat/z80.cpp, cpu.cpp, cpu.h)
- Uses Marat Fayzullin's portable Z80 core, with MEKA-specific hooks for memory and I/O access (RdZ80, WrZ80, InZ80, OutZ80).
- Interrupt handling supports IM0, IM1, IM2, and NMI; NMI jumps to $0066, IRQ to $0038.
- Registers: AF, BC, DE, HL, IX, IY, SP, PC, plus shadow registers and flags.
- Emulation loop (RunZ80) fetches, decodes, and executes instructions, calling LoopZ80 for periodic hardware interrupts.
- Cycle counting and opcode usage statistics are tracked for debugging and timing accuracy.
- Reset initializes registers to typical SMS startup values (PC=0, SP=DFF0, etc.).

### VDP (Video Display Processor) (vdp.cpp, vdp.h, meka.h)
- Emulates TMS9918A/VDP with 16 registers, 16KB VRAM, and CRAM for palettes.
- Video mode is determined by bits in VDP registers 0 and 1; supports multiple modes (SMS, GG, TMS9918).
- Register writes update video mode, scrolling, sprite attributes, and tilemap addresses.
- VDP status register tracks VBlank, sprite collision, and 9th sprite flags.
- VRAM and CRAM access is managed via address/data ports, with latching and auto-increment.
- Palette writes update CRAM and trigger RGB conversion for display.

### Sound (sound.cpp, psg.cpp, fmunit.h, emu2413)
- SN76489 PSG emulation: 4 channels (3 tone, 1 noise), 16 volume steps, white/periodic noise via LFSR.
- PSG register writes update tone frequency, volume, and noise parameters.
- FM sound (YM2413) supported via EMU2413 core, with 9 channels and 16 instruments.
- Sound engine manages sample rate, buffer, and cycle synchronization with CPU.
- VGM logging for audio output and debugging.

### Input (inputs.h, inputs_t.h)
- Supports multiple peripherals: joypad, light phaser, paddle, sports pad, graphic board.
- Input mapping for keyboard, joystick, mouse; digital and analog support.
- Pause and reset buttons mapped to NMI and system reset events.
- Input state is polled and updated each frame; GUI input handling integrated.

### Patch System (patch.h)
- Supports ROM and memory patching for game fixes and hacks.
- Patches are applied based on CRC checks or universally.
- Actions include seek and write, with support for MEKA-specific patch files.

### Memory Mapping (meka.h, bmemory.cpp, mappers.h)
- Memory map: $0000-$bfff (cartridge ROM/RAM), $c000-$dfff (system RAM), $e000-$ffff (RAM mirror).
- Supports multiple mappers for different cartridge types (standard, CodeMasters, Korean, etc.).
		- SRAM and EEPROM emulation for battery-backed saves.
		- Memory pages are mapped dynamically based on mapper registers.

---

## Debug Class ROM Header Extraction Results (Jan 11, 2026)

- Implemented dynamic scan for TMR SEGA signature in ROMs.
- Extracted all possible SMS ROM header fields:
	- title (16 bytes before signature, often unused/padded)
	- tmrSega (8 bytes, 'TMR SEGA')
	- region (Export/Japan, from region byte)
	- checksum (2 bytes)
	- productCode (2 bytes, BCD)
	- version (1 byte)
	- sizeKB (1 byte, 16KB units)
	- reserved (1 byte)
	- copyright (8 bytes after header, sometimes present)
	- countryCode (1 byte after copyright)
	- rawHeader (full header bytes)
	- hexHeader (header bytes as hex string)

- Test results:
	- Bomber Raid (World).sms: TMR SEGA found, title unused/padded, all fields extracted.
	- Sonic The Hedgehog (USA, Europe).sms: TMR SEGA found, title unused/padded, all fields extracted.

- Extraction logic matches SMS hardware spec; title field may be empty or padded in many ROMs.
- Debug class ready for heavy use in Z80/VDP development and further header analysis.