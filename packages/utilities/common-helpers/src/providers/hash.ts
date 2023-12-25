import CryptoJS from 'crypto-js';

export const hash = (str: string): string => {
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex).substring(0, 32);
};
