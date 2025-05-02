import { Core2D5 } from "../model/core";
import { Observer } from "../utils/observer";

export const Signals = {
  render: new Observer<(core: Core2D5) => void>(),
  mouseDown: new Observer<(event: MouseEvent) => void>(),
  select: new Observer<(axis: "x" | "y" | "z", x: number, y: number, z: number) => void>(),
  unselect: new Observer<(axis: "x" | "y" | "z", x: number, y: number, z: number) => void>(),
} as const;