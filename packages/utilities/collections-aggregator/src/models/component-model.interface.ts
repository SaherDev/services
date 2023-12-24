export interface IComponentModel {
  id: string;
  get collection(): string;
  get key(): string;
  get entry(): string;
  getData(): any;
}
