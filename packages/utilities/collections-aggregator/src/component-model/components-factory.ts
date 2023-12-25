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

  public createComponents(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any = {}
  ) {
    return this._createComponents(startName, metaConfig, rawData);
  }

  private async _createComponents(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any,
    result: Record<string, IComponentModel> = {}
  ): Promise<[string, Record<string, IComponentModel>]> {
    const entry = this._getComponentEntry(startName, metaConfig);
    const _class = this._createComponentClassType(entry.classTypeName);

    this._validateComponentData(_class, rawData);

    const component = this._createComponentInstance(
      startName,
      metaConfig,
      entry,
      _class,
      rawData,
      result
    );

    return [component.id, result];
  }

  private _getComponentEntry(
    componentName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>
  ): IComponentsMeta {
    const entry = metaConfig[componentName];

    if (!entry) {
      throw new Error(
        `ComponentsFactory >> createComponents failed, meta config not found for ${componentName}`
      );
    }

    return entry;
  }

  private _validateComponentData(
    _class: IComponentClassType,
    rawData: any
  ): void {
    try {
      _class.validate(rawData);
    } catch (error) {
      throw new Error(
        `ComponentsFactory >> createComponents failed, ${error.message}`
      );
    }
  }

  private _createComponentInstance(
    componentName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    entry: IComponentsMeta,
    _class: IComponentClassType,
    rawData: any,
    finalResult: Record<string, IComponentModel>
  ): IComponentModel {
    const component: IComponentModel = new ComponentModel(
      componentName,
      entry.collection
    );

    this._populateComponentAttributes(
      metaConfig,
      _class,
      component,
      rawData,
      finalResult
    );

    return component;
  }

  private async _populateComponentAttributes(
    metaConfig: Record<string, IComponentsMeta>,
    _class: IComponentClassType,
    component: IComponentModel,
    rawData: any,
    finalResult: Record<string, IComponentModel>
  ): Promise<void> {
    for (const key of Object.keys(rawData)) {
      if (_class.isAChild(key) && typeof rawData[key] === 'object') {
        component[key] = [];

        for (const child of rawData[key]) {
          if (typeof child === 'object') {
            const [childId, childResult] = await this._createComponents(
              `${component.entry}.${key}`,
              metaConfig,
              child,
              finalResult
            );
            component[key].push(childId);
            Object.assign(finalResult, childResult);
          } else {
            component[key].push(child);
          }
        }
      } else if (_class.isAChild(key) && typeof rawData[key] === 'object') {
        const [childId, childResult] = await this._createComponents(
          `${component.entry}.${key}`,
          metaConfig,
          rawData[key],
          finalResult
        );

        component[key] = childId;
        Object.assign(finalResult, childResult);
      } else {
        component[key] = rawData[key];
      }
    }

    const key = component.key;
    const existingComponent = finalResult[key];
    if (existingComponent) {
      component.id = existingComponent.id;
    } else {
      finalResult[key] = component;
    }
  }

  private _createComponentClassType(name: string): IComponentClassType {
    const _class = this._componentClassTypeDictionary[name];
    return _class;
  }
}
