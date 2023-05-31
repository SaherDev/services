const keySeparator = '.';
export class ObjectFieldsAccessor {
  static setValue(
    targetKey: Readonly<string>,
    target: any = {},
    value: any
  ): void {
    const keyParts = targetKey.split(keySeparator);
    let currentTarget = target;

    for (let i = 0; i < keyParts.length; i++) {
      const keyPart = keyParts[i];

      if (i === keyParts.length - 1) {
        currentTarget[keyPart] = value;
      } else {
        if (isNaN(parseInt(keyParts[i + 1]))) {
          if (!(keyPart in currentTarget)) {
            currentTarget[keyPart] = {};
          }
        } else {
          if (!(keyPart in currentTarget)) {
            currentTarget[keyPart] = [];
          }
        }

        currentTarget = currentTarget[keyPart];
      }
    }
  }

  static getValues(object: any = {}, accessKey: Readonly<string[]>): any[] {
    return accessKey.map((key) => {
      return key.split(keySeparator).reduce((currentValue, keyPart) => {
        if (
          currentValue &&
          typeof currentValue === 'object' &&
          keyPart in currentValue
        ) {
          return currentValue[keyPart];
        } else {
          return undefined;
        }
      }, object);
    });
  }
}
