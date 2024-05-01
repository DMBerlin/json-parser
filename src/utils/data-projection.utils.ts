const operators: Map<string, (args: any) => any> = new Map<
  string,
  (...args: any[]) => any
>()
  .set("$toString", (value: any) => String(value))
  .set("$toNumber", (value: string) => Number(value))
  .set("$toUpper", (value: string) => value.toUpperCase())
  .set("$ifNull", (value: any, defaultValue: any) => value ?? defaultValue)
  .set("$multiply", (values: number[]) =>
    values.reduce((accumulator: number, base: number) => accumulator * base, 1),
  );

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

export function resolvePathValues(
  source: Record<string, any>,
  blueprint: Record<string, any>,
): Record<string, any> {
  for (const [key, value] of Object.entries(blueprint)) {
    if (
      typeof value === "string" &&
      value.startsWith("$") &&
      !operators.has(value)
    ) {
      blueprint[key] = getValueByPath(source, value);
    } else if (typeof value === "object") {
      resolvePathValues(source, value);
    }
  }
  return blueprint;
}

export function resolveOperators(
  blueprint: Record<string, any>,
): Record<string, any> {
  for (const [key, value] of Object.entries(blueprint)) {
    if (value instanceof Object) {
      if (value instanceof Array) {
        blueprint[key] = value.map((val) => resolveOperators(val));
        blueprint = operators.get(key)(blueprint[key]);
      } else {
        blueprint[key] = resolveOperators(value);
      }
    } else if (operators.has(key) && !(value instanceof Object)) {
      const operator = operators.get(key);
      blueprint = operator(value);
    } else if (operators.has(key) && value instanceof Object) {
      blueprint[key] = resolveOperators(value);
    }
  }
  return blueprint;
}
