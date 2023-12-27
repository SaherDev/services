import { IComponentClassType } from '@services/collections-aggregator';

export class MemberComponent implements IComponentClassType {
  childrenNames: string[] = ['name'];
  name: string;

  constructor(args: { name: string }) {
    this._validate(args);
    this.name = args.name;
  }

  private _validate(args: { name: string }): void {
    if (!args.name) {
      throw new Error('MemberComponent >> constructor >> name is required');
    }
  }

  isAChild(childName: string): boolean {
    return this.childrenNames.includes(childName);
  }
}
