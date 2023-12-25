export interface IComponentClassType {
  readonly childrenNames: string[];
  isAChild(childName: string): boolean;
}
