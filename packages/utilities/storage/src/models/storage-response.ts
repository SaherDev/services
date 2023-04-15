export interface StorageResponse<T> {
  success: boolean;
  errorMessage?: string;
  returnObject?: T;
}
