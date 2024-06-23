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
  return parseFloat(num.replace(/,/g, ''));
};

export const deletePropertyWhenEmpty = (obj: Record<string, any>) => {
  for (const key in obj) {
    if (obj[key] === '') delete obj[key];
  }
  return obj;
};
