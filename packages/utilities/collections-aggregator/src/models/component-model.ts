import { IComponentModel } from './component-model.interface';

export class ComponentModel implements IComponentModel {
  public id: string;
  public collection: string;
  public entry: string;
  constructor(entry: string, collection: string) {
    this.entry = entry;
    this.collection = collection;
    this.id = Math.random().toString(36);
  }

  getData(): Omit<ComponentModel, 'collection' | 'entry'> {
    let result: Omit<ComponentModel, 'collection' | 'entry'> = { ...this };
    return result;
  }
}
