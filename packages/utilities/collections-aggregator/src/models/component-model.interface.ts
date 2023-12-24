export interface IComponentModel {
  readonly id: string;
  readonly entry: string;
  getData(): any;
  [key: string]: any;
}
