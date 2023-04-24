export const isArraySubset = (arrayA: string[], arrayB: string[]): boolean => {
  return arrayA.every((element) => arrayB.includes(element));
};
