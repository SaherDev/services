export interface IAdapterTransformerConfig {
  accessKeys: string[];
  target: string;
  defaultValue?: any;
  lookupName?: string;
  accessFnc?: string;
  validate?: {
    condition: string;
    severity: string;
    message: string;
  };
}
