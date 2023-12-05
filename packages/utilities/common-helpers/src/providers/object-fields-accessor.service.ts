import _ from 'lodash';
export class ObjectFieldsAccessor {
  static fillEmptyProperties<T>(obj: Partial<T>, properties: T): any {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
      return obj;

    for (const key of Object.keys(properties)) {
      if (!obj.hasOwnProperty(key)) {
        obj[key] = properties[key];
      } else if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        typeof properties[key] === 'object' &&
        properties[key] !== null
      ) {
        this.fillEmptyProperties(obj[key], properties[key]);
      }
    }

    return obj;
  }

  static setValue(
    targetKey: Readonly<string>,
    target: any = {},
    value: any
  ): void {
    _.set(target, targetKey, value);
  }

  static getValues(object: any = {}, accessKey: Readonly<string[]>): any[] {
    return accessKey.map((key) => _.get(object, key, undefined));
  }
}
