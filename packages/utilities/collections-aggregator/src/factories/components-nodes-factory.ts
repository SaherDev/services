import {
  ComponentNode,
  IComponentClassType,
  IComponentNode,
  IComponentsMeta,
} from '../models';

type ClassType = new (...args: any[]) => IComponentClassType;
const META_KEY_SEPARATOR = '.';
export class ComponentsNodesFactory {
  constructor(
    private readonly _componentClassTypeDictionary: Record<string, ClassType>,
    private readonly _whitelist: boolean = false
  ) {}

  public buildMetaDictionaryTree(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>
  ): Map<string, string[]> {
    const entry: IComponentsMeta = this._getComponentNodeMeta(
      startName,
      metaConfig
    );

    const queue = [entry.name];
    const map = new Map<string, string[]>();
    const metaConfigCopy = { ...metaConfig };
    while (queue.length) {
      const currentNode = queue.shift();

      for (const [key, _] of Object.entries(metaConfigCopy)) {
        if (
          key.split(META_KEY_SEPARATOR)?.[0] === currentNode &&
          currentNode !== key
        ) {
          const childNode = key.split(META_KEY_SEPARATOR)?.at(-1);
          const parent = map.get(currentNode) ?? [];
          parent.push(childNode);
          map.set(currentNode, parent);
          queue.push(childNode);
          delete metaConfigCopy[key];
        }
      }
    }

    return map;
  }

  public async toComponentClass(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    data = {}
  ): Promise<IComponentClassType> {
    const entryMetaConfig = metaConfig[startName];
    if (!entryMetaConfig) {
      throw new Error(
        `ComponentsFactory >> toComponentClass failed, meta config not found for ${startName}`
      );
    }

    const [, _class] = await this._createComponentsNodes(
      startName,
      metaConfig,
      data[entryMetaConfig.name]
    );

    return _class;
  }

  public async splitIntoComponentsNodes(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any = {}
  ): Promise<[string, Record<string, IComponentNode>]> {
    const entryMetaConfig = metaConfig[startName];
    if (!entryMetaConfig) {
      throw new Error(
        `ComponentsFactory >> createComponents failed, meta config not found for ${startName}`
      );
    }

    const [id, _, result] = await this._createComponentsNodes(
      startName,
      metaConfig,
      rawData[entryMetaConfig.name]
    );

    return [id, result];
  }

  private async _createComponentsNodes(
    startName: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any,
    result: Record<string, IComponentNode> = {}
  ): Promise<[string, IComponentClassType, Record<string, IComponentNode>]> {
    const entry = this._getComponentNodeMeta(startName, metaConfig);
    let _class = this._createComponentClassType(entry.classTypeName, rawData);

    const componentNode: IComponentNode = new ComponentNode(entry.collection);

    await this._processRawData(
      entry,
      metaConfig,
      rawData,
      _class,
      componentNode,
      result
    );

    const key = componentNode.key;
    const existingComponent = result[key];

    if (existingComponent) {
      componentNode.id = existingComponent.id;
    } else {
      result[key] = componentNode;
    }

    return [componentNode.id, _class, result];
  }

  private async _processRawData(
    entry: IComponentsMeta,
    metaConfig: Record<string, IComponentsMeta>,
    rawData: any,
    _class: IComponentClassType,
    componentNode: IComponentNode,
    result: Record<string, IComponentNode>
  ): Promise<void> {
    for (const [key, value] of Object.entries(rawData)) {
      if (_class.isAChild(key) && typeof value === 'object') {
        await this._processChildNode(
          entry,
          metaConfig,
          key,
          value,
          _class,
          componentNode,
          result
        );
      } else if (
        !this._whitelist ||
        (this._whitelist && _class.isAChild(key))
      ) {
        componentNode[key] = value;
      }
    }
  }

  private async _processChildNode(
    entry: IComponentsMeta,
    metaConfig: Record<string, IComponentsMeta>,
    childKey: string,
    childValue: any,
    _class: IComponentClassType,
    componentNode: IComponentNode,
    result: Record<string, IComponentNode>
  ): Promise<void> {
    if (Array.isArray(childValue)) {
      await this._processArrayChildNode(
        entry,
        metaConfig,
        childKey,
        childValue,
        _class,
        componentNode,
        result
      );
    } else if (typeof childValue === 'object') {
      await this._processObjectChildNode(
        entry,
        metaConfig,
        childKey,
        childValue,
        _class,
        componentNode,
        result
      );
    }
  }

  private async _processArrayChildNode(
    entry: IComponentsMeta,
    metaConfig: Record<string, IComponentsMeta>,
    childKey: string,
    childArray: any[],
    _class: IComponentClassType,
    componentNode: IComponentNode,
    result: Record<string, IComponentNode>
  ): Promise<void> {
    componentNode[childKey] = [];
    _class[childKey] = [];
    for (const child of childArray) {
      if (typeof child === 'object') {
        const [childId, _childClass, childResult] =
          await this._createComponentsNodes(
            `${entry.name}${META_KEY_SEPARATOR}${childKey}`,
            metaConfig,
            child,
            result
          );
        _class[childKey].push(_childClass);
        componentNode[childKey].push(childId);
        Object.assign(result, childResult);
      } else {
        componentNode[childKey].push(child);
      }
    }
  }

  private async _processObjectChildNode(
    entry: IComponentsMeta,
    metaConfig: Record<string, IComponentsMeta>,
    childKey: string,
    childObject: any,
    _class: IComponentClassType,
    componentNode: IComponentNode,
    result: Record<string, IComponentNode>
  ): Promise<void> {
    const [childId, _childClass, childResult] =
      await this._createComponentsNodes(
        `${entry.name}${META_KEY_SEPARATOR}${childKey}`,
        metaConfig,
        childObject,
        result
      );
    _class[childKey] = _childClass;
    componentNode[childKey] = childId;
    Object.assign(result, childResult);
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
