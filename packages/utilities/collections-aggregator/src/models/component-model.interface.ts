export interface IComponentModel {
  get collection(): string;
  get key(): string;
  get entry(): string;
  id: string;
  set(key: string, value: any): void;
  get(key: string): any;
  getAll(): any;
}
