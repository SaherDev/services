import { IDatabaseFindManyQuey } from '@services/models';

export const generateMongoQuery = <T>(
  searchCriteria: IDatabaseFindManyQuey<T>
): Partial<Record<keyof T, any>> => {
  const query: Partial<Record<keyof T, any>> = {};

  for (const key in searchCriteria) {
    if (searchCriteria.hasOwnProperty(key)) {
      const value = searchCriteria[key];
      query[key] = Array.isArray(value) ? { $in: value } : value;
    }
  }

  return query;
};
