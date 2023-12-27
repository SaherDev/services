import { AuthorComponent } from './author-component';
import { IComponentClassType } from '@services/collections-aggregator';

export class BookComponent implements IComponentClassType {
  childrenNames: string[] = ['authors'];
  title: string;
  authors: AuthorComponent[];

  constructor(args: { title: string; authors: AuthorComponent[] }) {
    this._validate(args);
    this.title = args.title;
    this.authors = args.authors;
  }

  private _validate(args: { title: string; authors: AuthorComponent[] }): void {
    if (!args.title) {
      throw new Error('BookComponent >> constructor >> title is required');
    }

    if (!args.authors || args.authors.length === 0) {
      throw new Error('BookComponent >> constructor >> authors are required');
    }
  }

  isAChild(childName: string): boolean {
    return this.childrenNames.includes(childName);
  }
}
