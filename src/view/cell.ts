import { MineEases } from "@dao3fun/mine-motion";
import { CellType } from "../types";
import { Vector2 } from "../utils/vector";
import { Signals } from "../controller/gameSignals";

export class Cell {
  path: SVGPathElement;
  svg: SVGSVGElement;
  transforms: string[] = new Array(6);
  selected: boolean = false;
  x: number = 0;
  y: number = 0;
  z: number = 0;

  static height = 100;

  constructor(
    public type: CellType = CellType.A,
    public axis: "x" | "y" | "z" = "z"
  ) {
    this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.path.setAttribute(
      "d",
      `
      M 86.6025, 0
      m 2, 2
      l 86.6025, 50
      l -86.6025, 50
      l -86.6025, -50
      l 86.6025, -50
    `
    );
    this.path.setAttribute("stroke-width", "2");
    this.path.setAttribute("stroke-linecap", "round");

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("class", "rhombus");
    this.svg.setAttribute("width", `${Cell.height * 1.73205}`);
    this.svg.setAttribute("height", `${Cell.height}`);
    this.svg.setAttribute("viewBox", `0 0 177 103`);
    this.svg.setAttribute("fill", "#fff");
    this.svg.setAttribute("stroke", "#000");
    this.svg.appendChild(this.path);
    this.svg.style.translate = "-50% -50%";
    this.svg.style.position = "absolute";

    if (this.type === CellType.A) {
      this.svg.setAttribute("fill", "#f59e0b");
    } else if (this.type === CellType.B) {
      this.svg.setAttribute("fill", "#06b6d4");
    } else if (this.type === CellType.C) {
      this.svg.setAttribute("fill", "#6366f1");
    }

    Signals.mouseDown.subscribe(this.onMouseDown.bind(this));
  }

  private onMouseDown(event: MouseEvent){
    const pos = this.svg.createSVGPoint();
    pos.x = event.clientX;
    pos.y = event.clientY;
    const pt = pos.matrixTransform(this.svg.getScreenCTM()?.inverse());
    if(this.path.isPointInFill(pt)){
      if(this.selected){
        Signals.unselect.notify(this.axis, this.x, this.y, this.z);
      }else{
        Signals.select.notify(this.axis, this.x, this.y, this.z);
      }
    }
  }

  setAnchor(anchorElement: HTMLElement) {
    anchorElement.appendChild(this.svg);
  }

  calcTransform(axis: "x" | "y" | "z", x: number, y: number, z: number) {
    // this.transforms = [];
    this.x = x;
    this.y = y;
    this.z = z;
    this.axis = axis;
    const sqrt3 = Math.sqrt(3);
    const height = Cell.height - 2;
    const paddingDelta = 0.5;
    // 位置修正，把菱形的一个顶点移动到锚点位置
    switch (axis) {
      case "x":
        this.transforms[0] = `rotate(120deg)`;
        this.transforms[1] = `translate(${(height * sqrt3) / 4 + paddingDelta}px, ${
          height / 4 + paddingDelta / sqrt3
        }px)`;
        break;
      case "y":
        this.transforms[0] = (`rotate(240deg)`);
        this.transforms[1] = (
          `translate(${(-height * sqrt3) / 4 - paddingDelta}px, ${
            height / 4 + paddingDelta / sqrt3
          }px)`
        );
        break;
      case "z":
        this.transforms[0] = (`rotate(0deg)`);
        this.transforms[1] = (
          `translate(0px, ${-height / 2 - (paddingDelta * 2) / sqrt3}px)`
        );
        break;
    }
    // 网格布局
    this.transforms[2] = (
      `translate(${height * ((y * sqrt3) / 2 - (x * sqrt3) / 2)}px, ${
        height * (z - x / 2 - y / 2)
      }px)`
    );
  }

  render(axis: "x" | "y" | "z", x: number, y: number, z: number) {
    this.calcTransform(axis, x, y, z);
    this.svg.style.transform = this.transforms.toReversed().join(" ");
    this.svg.style.filter = this.selected ? "brightness(1.3)" : "";
  }

  /**
   * 创建旋转动画
   * @param deg 旋转角度
   * @param pos 中心点的坐标
   */
  animateRotation(deg: number, pos: Vector2) {
    const transitionTime = 500;
    const start = performance.now();
    this.transforms.splice(3, 0, `translate(${-pos.x}px, ${-pos.y}px)`, `rotate(${deg}deg)`, `translate(${pos.x}px, ${pos.y}px)`);
    this.svg.style.zIndex = "128";
    this.svg.style.transform = this.transforms.toReversed().join(" ");
    const f = () => {
      const now = performance.now();
      this.transforms[4] = `rotate(${
        MineEases.easeInOut((now - start) / transitionTime) * deg - deg
      }deg)`;
      if (now - start < transitionTime) {
        requestAnimationFrame(f);
      } else {
        this.transforms.splice(3, 0, "", "", "");
        this.svg.style.zIndex = "";
      }
      this.svg.style.transform = this.transforms.toReversed().join(" ");
    };
    f();
  }
}
