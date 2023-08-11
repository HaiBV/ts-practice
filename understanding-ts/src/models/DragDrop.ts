export interface Dragable {
  dragStartHandle(e: DragEvent): void;
  dragEndHandle(e: DragEvent): void;
}

export interface DragTarget {
  dragOverHandle(e: DragEvent): void;
  dropHandle(e: DragEvent): void;
  dragLeaveHandle(e: DragEvent): void;
}
