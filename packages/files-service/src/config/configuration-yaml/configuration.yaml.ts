import * as yaml from 'js-yaml';

import { readFileSync } from 'fs';

export const configurationYaml = (pathToFile: Readonly<string>) => {
  return yaml.load(readFileSync(pathToFile, 'utf8')) as Record<string, any>;
};
