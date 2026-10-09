declare module 'gifenc' {
  export function GIFEncoder(opts?: { autoSort?: boolean }): {
    writeHeader(): void;
    writeFrame(
      index: Uint8Array | number[],
      width: number,
      height: number,
      opts?: { palette?: number[][]; delay?: number; transparent?: boolean },
    ): void;
    finish(): void;
    bytes(): Uint8Array;
    reset(): void;
  };
  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray | number[],
    maxColors: number,
    opts?: { format?: string },
  ): number[][];
  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray | number[],
    palette: number[][],
    format?: string,
  ): Uint8Array;
  export function nearestColor(pixel: number[], palette: number[][]): number;
}
