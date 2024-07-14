import { formatNumeral, NumeralThousandGroupStyles } from 'cleave-zen';

export const toThousandFlag = (
  num: number | string,
  separateDecimal = 12,
  isPositiveOnly = false,
) => {
  return formatNumeral('' + num, {
    numeralThousandsGroupStyle: NumeralThousandGroupStyles.THOUSAND,
    numeralDecimalScale: separateDecimal,
    numeralPositiveOnly: isPositiveOnly,
  });
};

export const toNumberFromThousandFlag = (num: string) => {
  return parseFloat(num?.replace(/,/g, ''));
};

export const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
