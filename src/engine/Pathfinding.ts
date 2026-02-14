export type Position = {
  x: number;
  y: number;
};

export type Node = {
  position: Position;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
};

export class Pathfinding {
  private static readonly DIRECTIONS = [
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 },  // Right
  ];

  private grid: number[][]; // 0 = wall, 1 = path
  private pathCache: Map<string, Position[]> = new Map();

  constructor(grid: number[][]) {
    this.grid = grid;
  }

  // Manhattan distance
  private heuristic(a: Position, b: Position): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  private getKey(start: Position, end: Position): string {
    return `${start.x},${start.y}-${end.x},${end.y}`;
  }

  public findPath(start: Position, end: Position): Position[] {
    const key = this.getKey(start, end);
    if (this.pathCache.has(key)) {
      return this.pathCache.get(key)!;
    }

    // Validation
    if (!this.isValid(start) || !this.isValid(end)) {
        return [];
    }

    const openList: Node[] = [];
    const closedList: Set<string> = new Set();
    
    const startNode: Node = {
      position: start,
      g: 0,
      h: this.heuristic(start, end),
      f: 0,
      parent: null,
    };
    startNode.f = startNode.g + startNode.h;
    
    openList.push(startNode);

    while (openList.length > 0) {
      // Sort by f value (lowest first) - Simple array sort for now, ideally PriorityQueue
      openList.sort((a, b) => a.f - b.f);
      const currentNode = openList.shift()!;

      const currentKey = `${currentNode.position.x},${currentNode.position.y}`;
      if (closedList.has(currentKey)) continue;
      closedList.add(currentKey);

      // Reached destination
      if (currentNode.position.x === end.x && currentNode.position.y === end.y) {
        const path = this.reconstructPath(currentNode);
        this.pathCache.set(key, path);
        return path;
      }

      // Generate neighbors
      for (const dir of Pathfinding.DIRECTIONS) {
        const neighborPos = {
          x: currentNode.position.x + dir.x,
          y: currentNode.position.y + dir.y,
        };

        if (!this.isValid(neighborPos) || this.isWall(neighborPos)) continue;
        if (closedList.has(`${neighborPos.x},${neighborPos.y}`)) continue;

        const gScore = currentNode.g + 1;
        
        // Check if neighbor is already in openList with better g
        const existingNode = openList.find(n => n.position.x === neighborPos.x && n.position.y === neighborPos.y);
        if (existingNode && gScore >= existingNode.g) continue;

        const neighborNode: Node = {
          position: neighborPos,
          g: gScore,
          h: this.heuristic(neighborPos, end),
          f: 0,
          parent: currentNode,
        };
        neighborNode.f = neighborNode.g + neighborNode.h;

        if (existingNode) {
            // Update existing
            existingNode.g = neighborNode.g;
            existingNode.f = neighborNode.f;
            existingNode.parent = neighborNode.parent;
        } else {
            openList.push(neighborNode);
        }
      }
    }

    return []; // No path found
  }

  private reconstructPath(node: Node): Position[] {
    const path: Position[] = [];
    let current: Node | null = node;
    while (current) {
      path.unshift(current.position);
      current = current.parent;
    }
    return path;
  }

  private isValid(pos: Position): boolean {
    return pos.y >= 0 && pos.y < this.grid.length && pos.x >= 0 && pos.x < this.grid[0].length;
  }

  private isWall(pos: Position): boolean {
    return this.grid[pos.y][pos.x] === 0; // Assuming 0 is wall
  }
  
  public clearCache() {
      this.pathCache.clear();
  }
}
