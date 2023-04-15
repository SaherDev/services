export interface IStorageResponse<T> {
  success: boolean;
  errorMessage?: string;
  returnObject?: T;
}
