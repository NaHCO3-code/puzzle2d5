import { GridInfo } from "../types";
import { createGrid } from "../utils/utils";

export class Core2D5 {
  gridX: GridInfo[][];
  gridY: GridInfo[][];
  gridZ: GridInfo[][];

  constructor(
    public size: number
  ){
    this.gridX = createGrid(size, () => ({depth: 0, type: 0}));
    this.gridY = createGrid(size, () => ({depth: 0, type: 0}));
    this.gridZ = createGrid(size, () => ({depth: 0, type: 0}));
  }

  dent(x: number, y: number, z: number){
    if(
      this.gridZ[x][y].depth !== z 
      || this.gridY[x][z].depth !== y 
      || this.gridX[y][z].depth !== x
    ){
      throw new Error("Invalid operation");
    }
    [this.gridZ[x][y], this.gridY[x][z], this.gridX[y][z]] = [this.gridX[y][z], this.gridZ[x][y], this.gridY[x][z]];
    this.gridZ[x][y].depth = z + 1;
    this.gridY[x][z].depth = y + 1;
    this.gridX[y][z].depth = x + 1;
  }

  jut(x: number, y: number, z: number){
    if(
      this.gridZ[x][y].depth !== z + 1
      || this.gridY[x][z].depth !== y + 1 
      || this.gridX[y][z].depth !== x + 1
    ){
      throw new Error("Invalid operation");
    }
    [this.gridZ[x][y], this.gridY[x][z], this.gridX[y][z]] = [this.gridX[y][z], this.gridZ[x][y], this.gridY[x][z]];
    this.gridZ[x][y].depth = z;
    this.gridY[x][z].depth = y;
    this.gridX[y][z].depth = x;
  }
}