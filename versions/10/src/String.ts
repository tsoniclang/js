
import type {} from "./type-bootstrap.js";

import type { char, int } from "@tsonic/core/types.js";
import { List } from "@tsonic/dotnet/System.Collections.Generic.js";
import {
  Char,
  Convert,
  Math as DotnetMath,
  String as DotnetString,
  StringComparison,
  StringSplitOptions,
} from "@tsonic/dotnet/System.js";
import {
  CompareOptions,
  CultureInfo,
} from "@tsonic/dotnet/System.Globalization.js";
import { NormalizationForm, StringBuilder } from "@tsonic/dotnet/System.Text.js";
import { Group, Regex } from "@tsonic/dotnet/System.Text.RegularExpressions.js";

const asDotnetString = (value: string): DotnetString =>
  value as unknown as DotnetString;

const getLength = (value: string): int => {
  const chars = asDotnetString(value).ToCharArray();
  return chars.length;
};

const clamp = (value: int, minimum: int, maximum: int): int => {
  if (value < minimum) {
    return minimum;
  }
  if (value > maximum) {
    return maximum;
  }
  return value;
};

const normalizeForm = (form?: string): NormalizationForm => {
  switch (form) {
    case "NFD":
      return NormalizationForm.FormD;
    case "NFKC":
      return NormalizationForm.FormKC;
    case "NFKD":
      return NormalizationForm.FormKD;
    case "NFC":
    default:
      return NormalizationForm.FormC;
  }
};

const toSinglePadChar = (value: string): char => {
  if (getLength(value) === 0) {
    return Convert.ToChar(" ");
  }
  return Convert.ToChar(asDotnetString(value).Substring(0 as int, 1 as int));
};

export const length = (value: string): int => getLength(value);

export const at = (value: string, index: int): string => {
  const actualIndex = index < 0 ? getLength(value) + index : index;
  if (actualIndex < 0 || actualIndex >= getLength(value)) {
    return "";
  }
  return asDotnetString(value).Substring(actualIndex, 1 as int);
};

export const charAt = (value: string, index: int): string => {
  if (index < 0 || index >= getLength(value)) {
    return "";
  }
  return asDotnetString(value).Substring(index, 1 as int);
};

export const charCodeAt = (value: string, index: int): int =>
  Char.ConvertToUtf32(value, index);

export const codePointAt = (value: string, index: int): int => {
  if (index < 0 || index >= getLength(value)) {
    return -1 as int;
  }
  return Char.ConvertToUtf32(value, index);
};

export const concat = (value: string, ...strings: string[]): string => {
  let result = value;
  for (let i = 0; i < strings.length; i += 1) {
    result += strings[i]!;
  }
  return result;
};

export const endsWith = (value: string, searchString: string): boolean =>
  asDotnetString(value).EndsWith(searchString);

export const includes = (value: string, searchString: string): boolean =>
  asDotnetString(value).Contains(searchString);

export const indexOf = (
  value: string,
  searchString: string,
  position: int = 0 as int
): int => asDotnetString(value).IndexOf(searchString, position);

export const isWellFormed = (value: string): boolean => {
  for (let i = 0 as int; i < getLength(value); i += 1) {
    const current = asDotnetString(value)[i]!;
    if (Char.IsSurrogate(current)) {
      if (Char.IsHighSurrogate(current)) {
        if (i + 1 >= getLength(value) || !Char.IsLowSurrogate(asDotnetString(value)[i + 1]!)) {
          return false;
        }
        i += 1;
      } else {
        return false;
      }
    }
  }

  return true;
};

export const lastIndexOf = (
  value: string,
  searchString: string,
  position?: int
): int => {
  if (position === undefined) {
    return asDotnetString(value).LastIndexOf(searchString);
  }
  return asDotnetString(value).LastIndexOf(
    searchString,
    clamp(position, 0 as int, getLength(value))
  );
};

export const localeCompare = (value: string, compareString: string): int =>
  CultureInfo.CurrentCulture.CompareInfo.Compare(
    value,
    compareString,
    CompareOptions.None
  );

export const match = (
  value: string,
  pattern: string
): string[] | undefined => {
  const regex = new Regex(pattern);
  const matched = regex.Match(value);
  if (!matched.Success) {
    return undefined;
  }
  const result = new List<string>();
  const groups = matched.Groups.GetEnumerator();
  while (groups.MoveNext()) {
    result.Add((groups.Current as Group).Value);
  }
  return result.ToArray();
};

export const matchAll = (value: string, pattern: string): string[][] => {
  const regex = new Regex(pattern);
  const matches = regex.Matches(value);
  const results = new List<string[]>();
  for (let i = 0; i < matches.Count; i += 1) {
    const match = matches[i]!;
    const groups = new List<string>();
    const matchGroups = match.Groups.GetEnumerator();
    while (matchGroups.MoveNext()) {
      groups.Add((matchGroups.Current as Group).Value);
    }
    results.Add(groups.ToArray());
  }
  return results.ToArray();
};

export const normalize = (value: string, form?: string): string =>
  asDotnetString(value).Normalize(normalizeForm(form));

export const padEnd = (
  value: string,
  targetLength: int,
  padString: string = " "
): string =>
  asDotnetString(value).PadRight(targetLength, toSinglePadChar(padString));

export const padStart = (
  value: string,
  targetLength: int,
  padString: string = " "
): string =>
  asDotnetString(value).PadLeft(targetLength, toSinglePadChar(padString));

export const repeat = (value: string, count: int): string => {
  let result = "";
  for (let i = 0 as int; i < count; i += 1) {
    result += value;
  }
  return result;
};

export const replace = (
  value: string,
  searchValue: string,
  replaceValue: string
): string => asDotnetString(value).Replace(searchValue, replaceValue);

export const replaceAll = (
  value: string,
  searchValue: string,
  replaceValue: string
): string => asDotnetString(value).Replace(searchValue, replaceValue);

export const search = (value: string, pattern: string): int => {
  const regex = new Regex(pattern);
  const matched = regex.Match(value);
  return matched.Success ? matched.Index : (-1 as int);
};

export const slice = (
  value: string,
  start: int = 0 as int,
  end?: int
): string => {
  const lengthValue = getLength(value);
  const actualStart: int =
    start < 0
      ? clamp(lengthValue + start, 0 as int, lengthValue)
      : clamp(start, 0 as int, lengthValue);
  const actualEnd: int =
    end === undefined
      ? lengthValue
      : end < 0
        ? clamp(lengthValue + end, 0 as int, lengthValue)
        : clamp(end, 0 as int, lengthValue);
  const sliceLength: int =
    actualEnd > actualStart ? actualEnd - actualStart : (0 as int);

  return asDotnetString(value).Substring(actualStart, sliceLength);
};

export const split = (
  value: string,
  separator: string,
  limit?: int
): string[] => {
  if (separator === "") {
    const chars = new List<string>();
    const maxLength: int =
      limit === undefined
        ? getLength(value)
        : limit < getLength(value)
          ? limit
          : getLength(value);
    for (let i = 0 as int; i < maxLength; i += 1) {
      chars.Add(charAt(value, i));
    }
    return chars.ToArray();
  }

  return limit === undefined
    ? asDotnetString(value).Split(separator, StringSplitOptions.None)
    : asDotnetString(value).Split(
        separator,
        limit,
        StringSplitOptions.None
      );
};

export const startsWith = (value: string, searchString: string): boolean =>
  asDotnetString(value).StartsWith(searchString);

export const substr = (
  value: string,
  start: int,
  substringLength?: int
): string => {
  const lengthValue = getLength(value);
  const actualStart =
    start < 0
      ? DotnetMath.Max(0 as int, lengthValue + start)
      : DotnetMath.Min(start, lengthValue);
  const actualLength =
    substringLength === undefined
      ? lengthValue - actualStart
      : DotnetMath.Max(0 as int, DotnetMath.Min(substringLength, lengthValue - actualStart));

  return asDotnetString(value).Substring(actualStart, actualLength);
};

export const substring = (
  value: string,
  start: int,
  end?: int
): string => {
  const lengthValue = getLength(value);
  const actualStart = clamp(start, 0 as int, lengthValue);
  const actualEnd = clamp(end ?? lengthValue, 0 as int, lengthValue);
  const lower = DotnetMath.Min(actualStart, actualEnd);
  const upper = DotnetMath.Max(actualStart, actualEnd);
  return asDotnetString(value).Substring(lower, upper - lower);
};

export const toLocaleLowerCase = (value: string): string =>
  asDotnetString(value).ToLower(CultureInfo.CurrentCulture);

export const toLocaleUpperCase = (value: string): string =>
  asDotnetString(value).ToUpper(CultureInfo.CurrentCulture);

export const toLowerCase = (value: string): string =>
  asDotnetString(value).ToLower();

export const toString = (value: string): string => value;

export const trim = (value: string): string => asDotnetString(value).Trim();

export const trimLeft = (value: string): string => trimStart(value);

export const trimRight = (value: string): string => trimEnd(value);

export const trimStart = (value: string): string =>
  asDotnetString(value).TrimStart();

export const trimEnd = (value: string): string =>
  asDotnetString(value).TrimEnd();

export const toUpperCase = (value: string): string =>
  asDotnetString(value).ToUpper();

export const toWellFormed = (value: string): string => {
  const builder = new StringBuilder();

  for (let i = 0 as int; i < getLength(value); i += 1) {
    const current = asDotnetString(value)[i]!;
    if (Char.IsSurrogate(current)) {
      if (Char.IsHighSurrogate(current)) {
        if (i + 1 < getLength(value) && Char.IsLowSurrogate(asDotnetString(value)[i + 1]!)) {
          builder.Append(current);
          builder.Append(asDotnetString(value)[i + 1]!);
          i += 1;
        } else {
          builder.Append("\uFFFD");
        }
      } else {
        builder.Append("\uFFFD");
      }
    } else {
      builder.Append(current);
    }
  }

  return builder.ToString();
};

export const valueOf = (value: string): string => value;

export const fromCharCode = (...codes: int[]): string => {
  let result = "";
  for (let i = 0; i < codes.length; i += 1) {
    result += Convert.ToChar(codes[i]!).toString();
  }
  return result;
};

export const fromCodePoint = (...codePoints: int[]): string => {
  let result = "";
  for (let i = 0; i < codePoints.length; i += 1) {
    result += Char.ConvertFromUtf32(codePoints[i]!);
  }
  return result;
};

export const raw = (
  template: List<string>,
  ...substitutions: unknown[]
): string => {
  const builder = new StringBuilder();

  for (let i = 0 as int; i < template.Count; i += 1) {
    builder.Append(template[i]!);
    if (i < substitutions.length) {
      builder.Append(`${substitutions[i]!}`);
    }
  }

  return builder.ToString();
};
