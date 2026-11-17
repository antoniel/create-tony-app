import { cardHeight, cardWidth, levels, type Level, type Point } from "./model";

export interface NodeSize {
  width: number;
  height: number;
}
export interface LayoutNode {
  id: string;
  level: Level;
  cluster: string;
}
export interface ClusterBand {
  id: string;
  label: string;
  level: Level;
  x: number;
  y: number;
  width: number;
  height: number;
  members: string[];
}
export function sizeOf(id: string, sizes: Record<string, NodeSize>): NodeSize {
  return sizes[id] ?? { width: cardWidth, height: cardHeight };
}
export function arrange(entries: LayoutNode[], sizes: Record<string, NodeSize>) {
  const positions: Record<string, Point> = {},
    columns: Partial<Record<Level, number>> = {},
    bands: ClusterBand[] = [];
  let x = 0;
  for (const level of levels) {
    const members = entries.filter((node) => node.level === level);
    columns[level] = x;
    const cellWidth = Math.max(cardWidth, ...members.map((node) => sizeOf(node.id, sizes).width));
    const columnCount = Math.min(2, Math.max(1, members.length));
    const width = columnCount * cellWidth + (columnCount - 1) * 30;
    let y = 100;
    for (const cluster of new Set(members.map((node) => node.cluster))) {
      const group = members.filter((node) => node.cluster === cluster);
      const top = y;
      y += 40;
      for (let i = 0; i < group.length; i += 2) {
        const row = group.slice(i, i + 2);
        row.forEach((node, column) => {
          positions[node.id] = { x: x + column * (cellWidth + 30), y };
        });
        y += Math.max(...row.map((node) => sizeOf(node.id, sizes).height)) + 30;
      }
      bands.push({
        id: `${level}-${cluster}`,
        label: cluster,
        level,
        x: x - 14,
        y: top,
        width: width + 28,
        height: y - top - 12,
        members: group.map((node) => node.id),
      });
      y += 24;
    }
    x += width + 110;
  }
  return { positions, columns, bands };
}
