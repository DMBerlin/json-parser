import { baseOriginFixture } from "@utils/__fixtures__/data-projection.fixtures";

const operators: Map<string, (args: any) => any> = new Map<
  string,
  (...args: any[]) => any
>()
  .set("$toString", (value: any) => String(value))
  .set("$toNumber", (value: string) => Number(value))
  .set("$toUpper", (value: string) => value.toUpperCase())
  .set("$ifNull", (value: any, defaultValue: any) => value ?? defaultValue)
  .set("$multiply", (values: number[]) => {
    return values
      .map(
        (value: number | Record<string, any>) =>
          (typeof value === "object" && isOperator(value)
            ? resolveOperation<number>(baseOriginFixture, value)
            : value) as number,
      )
      .reduce((accumulator: number, base: number) => accumulator * base, 1);
  });

function getValueByPath(
  source: Record<string, unknown>,
  path: string,
): unknown {
  return path.at(0) === "$"
    ? path
        .slice(1)
        .split(".")
        .reduce((obj: Record<string, any>, key: string) => obj[key], source)
    : undefined;
}

function isOperator(obj: Record<string, any>): boolean {
  const keys = Object.keys(obj);
  return keys.length === 1 && keys[0].startsWith("$") && operators.has(keys[0]);
}

function resolveOperation<T>(
  source: Record<string, any>,
  operator: Record<string, any>,
): T {
  const key = Object.keys(operator)[0];
  const value = isPathValue(operator[key])
    ? getValueByPath(source, operator[key])
    : operator[key];
  const executable = operators.get(key);
  return executable(value);
}

function isPathValue(value: string): boolean {
  return (
    typeof value === "string" && value.startsWith("$") && !operators.has(value)
  );
}

function isObject(value: any): boolean {
  return value instanceof Object && !Array.isArray(value);
}

export function bfsParseTraversal(
  source: Record<string, any>,
  blueprint: Record<string, any>,
): Record<string, any> {
  for (const key of Object.keys(blueprint)) {
    if (isPathValue(blueprint[key])) {
      blueprint[key] = getValueByPath(source, blueprint[key]);
    } else if (isObject(blueprint[key])) {
      if (isOperator(blueprint[key])) {
        blueprint[key] = resolveOperation(source, blueprint[key]);
      } else {
        blueprint[key] = bfsParseTraversal(source, blueprint[key]);
      }
    }
  }

  return blueprint;
}
