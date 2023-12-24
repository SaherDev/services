export interface IComponentClassType {
  new (...args: any[]): any;
  readonly childrens: string[];
  validate(rawData: any): boolean;
}
