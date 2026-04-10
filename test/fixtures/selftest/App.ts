import type { int, long } from "@tsonic/core/types.js";
import type { Date as SourceDate } from "@tsonic/js/index.js";

export function main(): void {
  const parsed: number = parseInt("42");
  const parsedFloat: number = parseFloat("42.5");
  const finite: boolean = isFinite(parsedFloat);
  const nan: boolean = isNaN(parseFloat("not-a-number"));
  const stringified: string = String(123);
  const numeric: number = Number("42");
  const truthy: boolean = Boolean(1);
  const falsey: boolean = Boolean(0);
  const rounded: number = Math.round(42.7);
  const epoch: number = Date.parse("2024-01-01T00:00:00Z");
  const now: long = Date.now();
  const utcDate: Date = new Date(epoch);
  const importedDate: SourceDate = new Date(epoch);
  const iso: string = utcDate.toISOString();
  const millis: long = importedDate.getTime();
  const encodedComponent: string = encodeURIComponent("a b+c");
  const decodedComponent: string = decodeURIComponent(encodedComponent);
  const encodedUri: string = encodeURI("https://example.com/a path?q=a b#x");
  const decodedUri: string = decodeURI(encodedUri);
  const stringLength: int = "tsonic".length;
  const bytes = new Uint8Array([1, 2, 3]);
  const copied = new Uint8Array(4);
  copied.set([4, 5], 1);
  copied.set(0, 9);
  const map = new Map<string, number>();
  map.set("answer", 42);
  const set = new Set<number>();
  set.add(1);
  set.add(2);
  set.add(3);
  const fromString = Array.from("abc");
  const fromIterable = Array.from([1, 2, 3], (value, index) => value + index);
  const values = new Array<number>();
  values.push(1, 2, 3, 4);
  const everyPositive = values.every((value) => value > 0);
  const filtered = values.filter((value, index) => value % 2 === 0 && index > 0);
  const found = values.find((value) => value === 3);
  const foundIndex = values.findIndex((value) => value === 3);
  const foundLast = values.findLast((value) => value % 2 === 0);
  const foundLastIndex = values.findLastIndex((value) => value % 2 === 0);
  let forEachTotal = 0;
  values.forEach((value) => {
    forEachTotal += value;
  });
  const mapped = values.map((value, index) => value + index);
  const reduced = values.reduce((sum, value) => sum + value, 0);
  const reducedRight = values.reduceRight((sum, value) => sum + value, 0);
  const hasLarge = values.some((value) => value > 3);
  const jsonText = JSON.stringify({ answer: 42, ok: true });
  const parsedJson = JSON.parse<{ answer: number; ok: boolean }>(jsonText);

  if (bytes.length !== 3) throw new Error("bad bytes");
  if (copied.join(",") !== "9,4,5,0") throw new Error("bad typed array set");
  if (map.get("answer") !== 42) throw new Error("bad map");
  if (set.size !== 3) throw new Error("bad set");
  if (!Array.isArray([1, 2, 3])) throw new Error("bad array");
  if (fromString.join("") !== "abc") throw new Error("bad Array.from string");
  if (fromIterable.join(",") !== "1,3,5") throw new Error("bad Array.from iterable");
  if (!everyPositive) throw new Error("bad Array.every");
  if (filtered.join(",") !== "2,4") throw new Error("bad Array.filter");
  if (found !== 3) throw new Error("bad Array.find");
  if (foundIndex !== 2) throw new Error("bad Array.findIndex");
  if (foundLast !== 4) throw new Error("bad Array.findLast");
  if (foundLastIndex !== 3) throw new Error("bad Array.findLastIndex");
  if (forEachTotal !== 10) throw new Error("bad Array.forEach");
  if (mapped.join(",") !== "1,3,5,7") throw new Error("bad Array.map");
  if (reduced !== 10) throw new Error("bad Array.reduce");
  if (reducedRight !== 10) throw new Error("bad Array.reduceRight");
  if (!hasLarge) throw new Error("bad Array.some");
  if (parsedJson.answer !== 42 || parsedJson.ok !== true) throw new Error("bad JSON.parse");
  if (stringLength !== 6) throw new Error("bad string length");
  if (!iso.startsWith("2024-01-01T00:00:00")) throw new Error("bad date iso");
  if (millis !== epoch) throw new Error("bad date millis");
  if (encodedComponent !== "a%20b%2Bc") throw new Error("bad encodeURIComponent");
  if (decodedComponent !== "a b+c") throw new Error("bad decodeURIComponent");
  if (!encodedUri.includes("https://example.com/a%20path?q=a%20b#x")) throw new Error("bad encodeURI");
  if (decodedUri !== "https://example.com/a path?q=a b#x") throw new Error("bad decodeURI");

  console.log(
    [
      parsed.toString(),
      parsedFloat.toString(),
      finite.toString(),
      nan.toString(),
      stringified,
      numeric.toString(),
      rounded.toString(),
      (epoch > 0).toString(),
      (now > 0).toString(),
      iso.startsWith("2024-01-01T00:00:00").toString(),
      (millis === epoch).toString(),
      truthy.toString(),
      String(falsey),
      encodedComponent,
      decodedComponent,
      encodedUri.includes("https://example.com/a%20path?q=a%20b#x").toString(),
      (decodedUri === "https://example.com/a path?q=a b#x").toString(),
      bytes.length.toString(),
      copied.join(","),
      map.get("answer")!.toString(),
      set.size.toString(),
      fromString.join(""),
      fromIterable.join(","),
      everyPositive.toString(),
      filtered.join(","),
      String(found),
      foundIndex.toString(),
      String(foundLast),
      foundLastIndex.toString(),
      forEachTotal.toString(),
      mapped.join(","),
      reduced.toString(),
      reducedRight.toString(),
      hasLarge.toString(),
      parsedJson.answer.toString(),
      parsedJson.ok.toString(),
    ].join(",")
  );
}
