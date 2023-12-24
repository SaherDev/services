import {
  ComponentModel,
  IComponentClassType,
  IComponentModel,
  IComponentsMeta,
} from '@/models';

export class ComponentsFactory {
  constructor(
    private readonly _componentClassTypeDictionary: Record<
      string,
      IComponentClassType
    >
  ) {}

  public async createComponents(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any = {}
  ): Promise<IComponentModel[]> {
    const root = metaConfig[startName];

    if (!root)
      throw new Error(
        `ComponentsFactory >> createComponents failed , meta config not found for ${startName} `
      );

    return Object.values(
      (await this._createComponents(
        startName,
        metaConfig,
        rawData[root.entry]
      )?.[1]) ?? {}
    );
  }

  public async _createComponents(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any = {}
  ): Promise<[string, Record<string, IComponentModel>]> {
    const entry = metaConfig[startName];

    if (!entry)
      throw new Error(
        `ComponentsFactory >> createComponents failed , meta config not found for ${startName} `
      );

    try {
      const _class = this._createComponentClassType(entry.classTypeName);
      _class.validate(rawData);
    } catch (error) {
      throw new Error(
        `ComponentsFactory >> createComponents failed , ${error.message} `
      );
    }

    const componentModel: IComponentModel = new ComponentModel(
      startName,
      entry.collection
    );

    return ['', {}];
  }

  private _createComponentClassType(name: string) {
    const _class = this._componentClassTypeDictionary[name];
    return _class;
  }
}
