import { hash, uuid } from '@services/common-helpers';

import { IComponentModel } from './component-model.interface';

export class ComponentModel implements IComponentModel {
  public id: string;
  public collection: string;
  public name: string;
  private dictionary: Record<string, any>;
  constructor(entry: string, collection: string) {
    this.name = entry?.split('.').at(-1) ?? entry;
    this.collection = collection;
    this.id = uuid();
    this.dictionary = {};
  }

  get key(): string {
    return Object.keys({
      ...this.dictionary,
      collection: this.collection,
    })
      .sort()
      .map((key) => `${key}:${JSON.stringify(this.dictionary[key])}`)
      .join('#_#');
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
