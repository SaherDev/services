export type IDatabaseFindManyQuey<T> = {
  [K in keyof T]?: T[K] | T[K][];
};
