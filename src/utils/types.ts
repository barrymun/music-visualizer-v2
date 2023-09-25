export type FftSize = 32 | 64 | 128 | 256 | 512 | 1024 | 2048;

export interface Track {
  name: string;
  src: string;
}

export type ChangeTrackCallback = () => number;
