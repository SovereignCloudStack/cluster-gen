import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GeistSans } from "geist/font/sans";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fontSans = GeistSans;

export function removeVariables(schema: any) {
  const newSchema = JSON.parse(JSON.stringify(schema));

  if (
    newSchema.properties &&
    newSchema.properties.spec &&
    newSchema.properties.spec.properties &&
    newSchema.properties.spec.properties.topology &&
    newSchema.properties.spec.properties.topology.properties
  ) {
    delete newSchema.properties.spec.properties.topology.properties.variables;
  }

  return newSchema;
}

export function transformVariables(input: any): any {
  const result: any = {
    properties: {},
  };

  input.items.forEach((item: any) => {
    if (item.type === "object" && item.properties) {
      const name = item.properties.name.default;
      const value = item.properties.value;

      if (value.type === "array") {
        result.properties[name] = {
          title: formatTitle(name),
          description: value.description,
          type: value.type,
          format: value.format,
          default: value.default,
          example: value.example,
          items: { type: item.properties.value.items.type },
        };
      } else if (item.properties.value.type === "object") {
        const subitems = item.properties.value.properties;
        console.log(subitems);

        //input.items.forEach((item: any) => { console.log(item) })
        //console.log(item.properties.value)
        //const subitems = Array.from(item.properties.value.properties)
        //console.log(subitems)
        //subitems.forEach((subitem: any) => {
        //console.log(subitems)
        //})
      } else {
        result.properties[name] = {
          title: formatTitle(name),
          description: value.description,
          type: value.type,
          format: value.format,
          default: value.default,
          example: value.example,
        };
      }
    }
  });

  return result;
}

{/*
export function formatTitle(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


*/}
















interface InputItem {
  properties: {
    name: {
      type: string;
      default: string;
      const: string;
    };
    value: any;
  };
}

interface OutputProperties {
  [key: string]: any;
}

export function transformDataStructure(input: InputItem[]): { properties: OutputProperties } {
  const output: { properties: OutputProperties } = { properties: {} };

  input.forEach((item) => {
    const key = item.properties.name.const;
    const value = item.properties.value;

    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        output.properties[key] = {
          title: formatTitle(key),
          ...transformArrayProperty(value)
        };
      } else if (value.properties) {
        output.properties[key] = {
          properties: transformNestedProperties(value.properties)
        };
      } else {
        output.properties[key] = transformSimpleProperty(key, value);
      }
    } else {
      output.properties[key] = transformSimpleProperty(key, { value });
    }
  });

  return output;
}

function transformNestedProperties(properties: Record<string, any>): OutputProperties {
  return Object.entries(properties).reduce((acc: OutputProperties, [propKey, propValue]) => {
    acc[propKey] = transformSimpleProperty(propKey, propValue);
    return acc;
  }, {});
}

function transformSimpleProperty(key: string, value: any): any {
  return {
    title: formatTitle(key),
    ...Object.entries(value).reduce((acc: any, [propKey, propValue]) => {
      if (propKey !== 'const' && propValue !== undefined) {
        acc[propKey] = propValue;
      }
      return acc;
    }, {})
  };
}

function transformArrayProperty(value: any[]): any {
  const firstItem = value[0];
  return {
    type: 'array',
    items: typeof firstItem === 'object' ? { type: 'object' } : { type: typeof firstItem },
    default: value,
    example: value
  };
}

export function formatTitle(key: string): string {
  return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}



















