import _ from 'lodash';
export class ObjectFieldsAccessor {
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
