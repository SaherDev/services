import { IComponentModel } from './component-model.interface';

export class ComponentModel implements IComponentModel {
  public readonly id: string;
  public readonly collection: string;
  public readonly entry: string;
  constructor(entry: string, collection: string) {
    this.entry = entry;
    this.collection = collection;
    this.id = '_';
  }
}
