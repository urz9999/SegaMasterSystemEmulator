import Z80 from './Z80';
import VDP from './VDP';
import Sound from './Sound';
import Input from './Input';
import Opcodes from './Opcodes';
import Patch from './Patch';
import Memory from './Memory';

export default class Emulator {
  private z80: Z80;
  private vdp: VDP;
  private sound: Sound;
  private input: Input;
  private opcodes: Opcodes;
  private patch: Patch;
  private memory: Memory;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;

  constructor(canvas?: HTMLCanvasElement) {
    this.z80 = new Z80();
    this.vdp = new VDP();
    this.sound = new Sound();
    this.input = new Input();
    this.opcodes = new Opcodes();
    this.patch = new Patch();
    this.memory = new Memory();
    if (canvas) {
      this.canvas = canvas;
      this.gl = canvas.getContext('webgl');
    }
  }
}
