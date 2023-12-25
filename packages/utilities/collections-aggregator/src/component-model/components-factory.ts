import {
  ComponentModel,
  IComponentClassType,
  IComponentModel,
  IComponentsMeta,
} from '@/models';

type ClassType = new (...args: any[]) => IComponentClassType;

export class ComponentsFactory {
  constructor(
    private readonly _componentClassTypeDictionary: Record<string, ClassType>
  ) {}

  public createComponents(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any = {}
  ) {
    const entryMetaConfig = metaConfig[startName];
    if (!entryMetaConfig) {
      throw new Error(
        `ComponentsFactory >> createComponents failed, meta config not found for ${startName}`
      );
    }

    return this._createComponents(
      startName,
      metaConfig,
      rawData[entryMetaConfig.entry]
    );
  }

  private async _createComponents(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any,
    result: Record<string, IComponentModel> = {}
  ): Promise<[string, Record<string, IComponentModel>]> {
    const entry = this._getComponentEntry(startName, metaConfig);
    let _class = this._createComponentClassType(entry.classTypeName, rawData);

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
        component.set(key, []);
        for (const child of rawData[key]) {
          if (typeof child === 'object') {
            const [childId, childResult] = await this._createComponents(
              `${component.entry}.${key}`,
              metaConfig,
              child,
              finalResult
            );
            component.get(key).push(childId);
            Object.assign(finalResult, childResult);
          } else {
            component.get(key).push(child);
          }
        }
      } else if (_class.isAChild(key) && typeof rawData[key] === 'object') {
        const [childId, childResult] = await this._createComponents(
          `${component.entry}.${key}`,
          metaConfig,
          rawData[key],
          finalResult
        );
        component.set(key, childId);
        Object.assign(finalResult, childResult);
      } else {
        component.set(key, rawData[key]);
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

  private _createComponentClassType(
    name: string,
    rawData: any
  ): IComponentClassType {
    try {
      const classType = this._componentClassTypeDictionary[name];
      return new classType(rawData);
    } catch (error) {
      throw new Error(
        `ComponentsFactory >> createComponentClassType failed, ${name} is not a valid class type`
      );
    }
  }
}
