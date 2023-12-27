import { IComponentClassType } from '@services/collections-aggregator';

export class AuthorComponent implements IComponentClassType {
  name: string;

  constructor(args: { name: string }) {
    this._validate(args);
    this.name = args.name;
  }
  childrenNames: string[];

  private _validate(args: { name: string }): void {
    if (!args.name) {
      throw new Error('AuthorComponent >> constructor >> name is required');
    }
  }

  isAChild(_childName: string): boolean {
    // Authors do not have children in this example
    return false;
  }
}
