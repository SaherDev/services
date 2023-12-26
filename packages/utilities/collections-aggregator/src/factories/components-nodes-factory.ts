import {
  ComponentNode,
  IComponentClassType,
  IComponentNode,
  IComponentsMeta,
} from '../models';

type ClassType = new (...args: any[]) => IComponentClassType;

export class ComponentsNodesFactory {
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

    return this._createComponentsNodes(
      startName,
      metaConfig,
      rawData[entryMetaConfig.name]
    );
  }

  private async _createComponentsNodes(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any,
    result: Record<string, IComponentNode> = {}
  ): Promise<[string, Record<string, IComponentNode>]> {
    const entry = this._getComponentNodeMeta(startName, metaConfig);
    let _class = this._createComponentClassType(entry.classTypeName, rawData);

    const componentNode: IComponentNode = new ComponentNode(entry.collection);

    for (const [key, value] of Object.entries(rawData)) {
      if (_class.isAChild(key) && typeof value === 'object') {
        if (Array.isArray(value)) {
          componentNode[key] = [];
          for (const child of value) {
            if (typeof child === 'object') {
              const [childId, childResult] = await this._createComponentsNodes(
                `${entry.name}.${key}`,
                metaConfig,
                child,
                result
              );
              componentNode[key].push(childId);
              Object.assign(result, childResult);
            } else {
              componentNode[key].push(child);
            }
          }
        } else if (typeof value === 'object') {
          const [childId, childResult] = await this._createComponentsNodes(
            `${entry.name}.${key}`,
            metaConfig,
            value,
            result
          );

          componentNode[key] = childId;
          Object.assign(result, childResult);
        }
      } else {
        componentNode[key] = value;
      }
    }

    const key = componentNode.key;
    const existingComponent = result[key];
    if (existingComponent) {
      componentNode.id = existingComponent.id;
    } else {
      result[key] = componentNode;
    }

    return [componentNode.id, result];
  }

  private _getComponentNodeMeta(
    componentName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>
  ): IComponentsMeta {
    const entry = metaConfig[componentName];

    if (!entry || !entry.classTypeName || !entry.collection) {
      throw new Error(
        `ComponentsFactory >> createComponents failed, meta config not found for ${componentName}`
      );
    }

    return entry;
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
