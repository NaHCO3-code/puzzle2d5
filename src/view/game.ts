import { Cell, } from "./cell";
import { Core2D5 } from "../model/core";
import { Vector2 } from "../utils/vector";
import { CellType } from "../types";
import { createGrid } from "../utils/utils";
import { Signals } from "../controller/gameSignals";

export class Game {
  gridX: Cell[][];
  gridY: Cell[][];
  gridZ: Cell[][];
  anchor: HTMLElement;
  container: HTMLElement;

  constructor(public cellHeight: number, public engine: Core2D5) {
    const size = this.engine.size;
    this.gridX = createGrid(size, () => new Cell(cellHeight, CellType.A));
    this.gridY = createGrid(size, () => new Cell(cellHeight, CellType.B));
    this.gridZ = createGrid(size, () => new Cell(cellHeight, CellType.C));
    this.anchor = document.getElementById("anchor") as HTMLElement;
    this.container = document.getElementById("game") as HTMLElement;
    this.initGrid();

    this.container.addEventListener("mousedown", (event) => {
      Signals.mouseDown.notify(event);
    })
    Signals.render.subscribe(this.render.bind(this));
    Signals.select.subscribe(this.onSelect.bind(this));
    Signals.unselect.subscribe(this.onUnselect.bind(this));
  }

  destroy(){
    Signals.render.unsubscribe(this.render.bind(this));
    Signals.select.unsubscribe(this.onSelect.bind(this));
    Signals.unselect.unsubscribe(this.onUnselect.bind(this));
    this.clearSelected();
    this.gridX.forEach(row => row.forEach(cell => cell.destroy()));
    this.gridY.forEach(row => row.forEach(cell => cell.destroy()));
    this.gridZ.forEach(row => row.forEach(cell => cell.destroy()));
  }

  private selectedCells: {x: Cell | null, y: Cell | null, z: Cell | null} = {
    x: null,
    y: null,
    z: null
  };

  clearSelected(){  
    if (this.selectedCells.x) this.selectedCells.x.selected = false;
    if (this.selectedCells.y) this.selectedCells.y.selected = false;
    if (this.selectedCells.z) this.selectedCells.z.selected = false;
    this.selectedCells.x = null;
    this.selectedCells.y = null;
    this.selectedCells.z = null;
  }

  private onSelect(axis: "x" | "y" | "z", x: number, y: number, z: number) {
    switch (axis) {
      case "x":
        if (this.selectedCells.x) this.selectedCells.x.selected = false;
        this.selectedCells.x = this.gridX[y][z];
        this.gridX[y][z].selected = true;
        break;
      case "y":
        if (this.selectedCells.y) this.selectedCells.y.selected = false;
        this.selectedCells.y = this.gridY[x][z];
        this.gridY[x][z].selected = true;
        break;
      case "z":
        if (this.selectedCells.z) this.selectedCells.z.selected = false;
        this.selectedCells.z = this.gridZ[x][y];
        this.gridZ[x][y].selected = true;
        break;
    }
    if(this.selectedCells.x && this.selectedCells.y && this.selectedCells.z) {
      const {x, y, z} = this.selectedCells;
      if(
        x.x === y.x && x.x === z.x 
        && x.y === y.y && x.y === z.y 
        && x.z === y.z && x.z === z.z
      ) {
        this.dent(x.x, x.y, x.z);
      }else if(
        x.x - 1 === y.x && x.x - 1 === z.x
        && x.y === y.y - 1 && x.y === z.y
        && x.z === y.z && x.z === z.z - 1
      ) {
        this.jut(x.x - 1, x.y, x.z);
      }
      this.clearSelected();
    }
    this.render(this.engine);
  }

  private onUnselect(axis: "x" | "y" | "z", x: number, y: number, z: number) {
    switch (axis) {
      case "x":
        this.selectedCells.x = null;
        this.gridX[y][z].selected = false;
        break;
      case "y":
        this.selectedCells.y = null;
        this.gridY[x][z].selected = false;
        break;
      case "z":
        this.selectedCells.z = null;
        this.gridZ[x][y].selected = false;
        break;
    }
    this.render(this.engine);
  }

  initGrid(){
    const size = this.engine.size;
    for (let x = 0; x < size; ++x) {
      for (let y = 0; y < size; ++y) {
        const c = this.gridZ[x][y];
        c.setAnchor(this.anchor);
      }
    }
    for (let x = 0; x < size; ++x) {
      for (let z = 0; z < size; ++z) {
        const c = this.gridY[x][z];
        c.setAnchor(this.anchor);
      }
    }
    for (let y = 0; y < size; ++y) {
      for (let z = 0; z < size; ++z) {
        const c = this.gridX[y][z];
        c.setAnchor(this.anchor);
      }
    }

  }

  render(engine: Core2D5) {
    const size = this.engine.size;
    for (let x = 0; x < size; ++x) {
      for (let y = 0; y < size; ++y) {
        const c = this.gridZ[x][y];
        c.render("z", x, y, engine.gridZ[x][y].depth);
      }
    }
    for (let x = 0; x < size; ++x) {
      for (let z = 0; z < size; ++z) {
        const c = this.gridY[x][z];
        c.render("y", x, engine.gridY[x][z].depth, z);
      }
    }
    for (let y = 0; y < size; ++y) {
      for (let z = 0; z < size; ++z) {
        const c = this.gridX[y][z];
        c.render("x", engine.gridX[y][z].depth, y, z);
      }
    }
  }

  dent(x: number, y: number, z: number) {
    this.engine.dent(x, y, z);
    [this.gridZ[x][y], this.gridY[x][z], this.gridX[y][z]] = [this.gridX[y][z], this.gridZ[x][y], this.gridY[x][z]];
    this.render(this.engine);
    const sqrt3 = Math.sqrt(3);
    const center = new Vector2(
      (y - x) * this.cellHeight * sqrt3 / 2,
      (2 * z - x - y) * this.cellHeight / 2
    )
    console.log("dent", x, y, z, center);
    this.gridX[y][z].animateRotation(60, center);
    this.gridY[x][z].animateRotation(60, center);
    this.gridZ[x][y].animateRotation(60, center);
  }

  jut(x: number, y: number, z: number){
    console.log("jut", x, y, z);
    this.engine.jut(x, y, z);
    [this.gridZ[x][y], this.gridY[x][z], this.gridX[y][z]] = [this.gridX[y][z], this.gridZ[x][y], this.gridY[x][z]];
    this.render(this.engine);
    const sqrt3 = Math.sqrt(3);
    const center = new Vector2(
      (y - x) * this.cellHeight * sqrt3 / 2,
      (2 * z - x - y) * this.cellHeight / 2
    )
    this.gridX[y][z].animateRotation(60, center);
    this.gridY[x][z].animateRotation(60, center);
    this.gridZ[x][y].animateRotation(60, center);
  }

  reset(){
    this.engine.reset();
    let cells = this.gridX.flat().concat(this.gridY.flat()).concat(this.gridZ.flat());
    this.gridX = createGrid(this.engine.size, () => null).map((_, i) =>
      cells.filter(c => c.type === CellType.A).slice(i * this.engine.size, (i + 1) * this.engine.size)
    );
    this.gridY = createGrid(this.engine.size, () => null).map((_, i) =>
      cells.filter(c => c.type === CellType.B).slice(i * this.engine.size, (i + 1) * this.engine.size)
    ); 
    this.gridZ = createGrid(this.engine.size, () => null).map((_, i) =>
      cells.filter(c => c.type === CellType.C).slice(i * this.engine.size, (i + 1) * this.engine.size)
    );
    this.clearSelected();
    this.render(this.engine);
  }
}
