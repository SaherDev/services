import { hash, uuid } from '@services/common-helpers';

import { IComponentNode } from './component-node.interface';

export class ComponentNode implements IComponentNode {
  public id: string;
  public collection: string;
  constructor(collection: string) {
    this.collection = collection;
    this.id = uuid();
  }

  get key(): string {
    return `${Object.keys(this)
      .filter((key) => key !== 'id')
      .sort()
      .map((key) => `${key}:${JSON.stringify(this[key])}`)
      .join('#_#')}`;
  }

  getAll(): any {
    const res = this;
    delete res.collection;
    return res;
  }
}
