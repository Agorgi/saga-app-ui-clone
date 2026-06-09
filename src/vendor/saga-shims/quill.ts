// Wireframe shim for the `quill` package. The clone never mounts a real Quill editor
// (the shared Editor renders an inert textarea), so this provides only the types the
// cloned crowd-commission wizard imports: the default `Quill` type plus Delta / Range /
// EmitterSource. All four are used in type position only (`import type ...`).

export interface Delta {
  ops: Array<Record<string, unknown>>;
}

export type EmitterSource = 'api' | 'user' | 'silent';

export interface Range {
  index: number;
  length: number;
}

export default class Quill {
  getContents(): Delta {
    return { ops: [] };
  }
  getText(): string {
    return '';
  }
  setContents(_delta: unknown): void {}
  on(): void {}
  off(): void {}
  root: HTMLElement = (typeof document !== 'undefined'
    ? document.createElement('div')
    : (undefined as unknown as HTMLElement));
}
