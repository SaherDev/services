import { hash, uuid } from '@services/common-helpers';

import { IComponentNode } from './component-node.interface';

export class ComponentNode implements IComponentNode {
  public id: string;
  public collection: string;
  public _v: string;
  constructor(collection: string, version: string) {
    this.collection = collection;
    this._v = version;
    this.id = uuid();
  }

  get key(): string {
    return hash(
      `${Object.keys(this)
        .filter((key) => key !== 'id')
        .sort()
        .map((key) => `${key}:${JSON.stringify(this[key])}`)
        .join('#_#')}`
    );
  }

  getAll(): any {
    const res = this;
    delete res.collection;
    return res;
  }
}
