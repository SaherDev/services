import { IComponentModel } from './component-model.interface';
import { uuid } from '@services/common-helpers';

export class ComponentModel implements IComponentModel {
  public id: string;
  public collection: string;
  public entry: string;
  private dictionary: Record<string, any>;
  constructor(entry: string, collection: string) {
    this.entry = entry;
    this.collection = collection;
    this.id = uuid();
    this.dictionary = {};
  }

  get key(): string {
    return Object.keys(this.dictionary)
      .sort()
      .map((key) => `${key}:${this.dictionary[key]}`)
      .join('#');
  }

  set(key: string, value: any): void {
    this.dictionary[key] = value;
  }

  get(key: string): any {
    return this.dictionary[key];
  }

  getAll(): any {
    return {
      ...this.dictionary,
      id: this.id,
    };
  }
}
