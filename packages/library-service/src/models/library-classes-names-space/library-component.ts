import { BookComponent } from './book-component';
import { IComponentClassType } from '@services/collections-aggregator';
import { LoanComponent } from './loan-component';
import { MemberComponent } from './member-component';

export class LibraryComponent implements IComponentClassType {
  childrenNames: string[] = ['book', 'member', 'loan'];
  name: string;

  constructor(args: {
    name: string;
    book: BookComponent[];
    member: MemberComponent[];
    loan: LoanComponent[];
  }) {
    this._validate(args);
    this.name = args.name;
  }

  private _validate(args: {
    name: string;
    book: BookComponent[];
    member: MemberComponent[];
    loan: LoanComponent[];
  }): void {
    if (
      !args.name ||
      !Array.isArray(args.book) ||
      !Array.isArray(args.member) ||
      !Array.isArray(args.loan)
    ) {
      throw new Error('LibraryComponent >> constructor >> name is required');
    }
  }

  isAChild(childName: string): boolean {
    return this.childrenNames.includes(childName);
  }
}
