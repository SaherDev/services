import { IComponentModel } from './component-model.interface';
import { uuid } from '@services/common-helpers';

export class ComponentModel implements IComponentModel {
  public id: string;
  public collection: string;
  public entry: string;
  constructor(entry: string, collection: string) {
    this.entry = entry;
    this.collection = collection;
    this.id = uuid();
  }

  getData(): Omit<ComponentModel, 'collection' | 'entry'> {
    let result: Omit<ComponentModel, 'collection' | 'entry'> = { ...this };
    return result;
  }

  get key(): string {
    const keys = Object.keys(this).filter((key) => key !== 'id');
    return keys
      .sort()
      .map((key) => `${key}:${this[key]}`)
      .join('#');
  }
}
