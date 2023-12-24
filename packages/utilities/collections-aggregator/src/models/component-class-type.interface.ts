export interface IComponentClassType {
  readonly childrens: string[];
  validate(rawData: any): boolean;
  isAChild(childName: string): boolean;
}
