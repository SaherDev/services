export interface IComponentNode {
  get collection(): string;
  get key(): string;
  id: string;
  getAll(): any;
}
