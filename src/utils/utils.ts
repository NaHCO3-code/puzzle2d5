export function createGrid<T>(size: number, fill: () => T){
  const grid: T[][] = new Array(size);
  for(let i = 0; i < size; ++i){
    grid[i] = new Array(size);
    for(let j = 0; j < size; ++j){
      grid[i][j] = fill();
    }
  }
  return grid
}