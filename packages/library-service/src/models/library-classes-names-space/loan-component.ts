import { IComponentClassType } from '@services/collections-aggregator';

export class LoanComponent implements IComponentClassType {
  childrenNames: string[] = ['dueDate'];

  dueDate: Date;

  constructor(args: { dueDate: Date }) {
    this._validate(args);
    this.dueDate = args.dueDate;
  }

  private _validate(args: { dueDate: Date }): void {
    if (!args.dueDate) {
      throw new Error('LoanComponent >> constructor >> dueDate is required');
    }
  }

  isAChild(_childName: string): boolean {
    return this.childrenNames.includes(_childName);
  }
}
