export interface IComponentModel {
  get collection(): string;
  get key(): string;
  get name(): string;
  id: string;
  set(key: string, value: any): void;
  get(key: string): any;
  getAll(): any;
}
