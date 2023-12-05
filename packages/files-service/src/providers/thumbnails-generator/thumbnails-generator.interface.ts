export interface IThumbnailsGenerator {
  create(id: Readonly<string>): Promise<any>;
}
