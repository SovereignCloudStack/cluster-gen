import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GeistSans } from "geist/font/sans";
import * as yaml from "js-yaml";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fontSans = GeistSans;

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

function transformDataStructure(input: InputItem[]): {
  properties: OutputProperties;
} {
  const output: { properties: OutputProperties } = { properties: {} };

  input.forEach((item) => {
    const key = item.properties.name.const;
    const value = item.properties.value;

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        output.properties[key] = {
          title: formatTitle(key),
          ...transformArrayProperty(value),
        };
      } else if (value.properties) {
        output.properties[key] = {
          properties: transformNestedProperties(value.properties),
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

function transformNestedProperties(
  properties: Record<string, any>,
): OutputProperties {
  return Object.entries(properties).reduce(
    (acc: OutputProperties, [propKey, propValue]) => {
      acc[propKey] = transformSimpleProperty(propKey, propValue);
      return acc;
    },
    {},
  );
}

function transformSimpleProperty(key: string, value: any): any {
  return {
    title: formatTitle(key),
    ...Object.entries(value).reduce((acc: any, [propKey, propValue]) => {
      if (propKey !== "const" && propValue !== undefined) {
        acc[propKey] = propValue;
      }
      return acc;
    }, {}),
  };
}

function transformArrayProperty(value: any[]): any {
  const firstItem = value[0];
  return {
    type: "array",
    items:
      typeof firstItem === "object"
        ? { type: "object" }
        : { type: typeof firstItem },
    default: value,
    example: value,
  };
}

function updateArrayObjects<T>(
  array: T[],
  key: string,
  modifier: (currentValue: any, object: T) => any,
): T[] {
  return array.map((obj) => {
    const newObj = JSON.parse(JSON.stringify(obj)); // Deep clone
    const keys = key.split(".");
    let current: any = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === undefined) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = modifier(current[lastKey], newObj);

    return newObj;
  });
}

function formatTitle(key: string): string {
  const fullCaps = ["id", "ip", "ssh", "dns", "cidr", "mtu", "oidc"];
  const customSpelling: { [key: string]: string } = {
    openstack: "OpenStack",
    apiserver: "API Server",
  };

  return key
    .split("_")
    .map((word) => word.toLowerCase())
    .join(" ")
    .replace(/\b\w+\b/g, (match) => {
      if (match in customSpelling) {
        return customSpelling[match];
      }
      if (fullCaps.includes(match)) {
        return match.toUpperCase();
      }
      return match.charAt(0).toUpperCase() + match.slice(1);
    });
}

type GenericObject = { [key: string]: any };

function convertVariablesFormat(obj: GenericObject): GenericObject {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertVariablesFormat);
  }

  const result: GenericObject = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      key === "variables" &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      result[key] = Object.entries(value).map(([name, val]) => ({
        name,
        value: val,
      }));
    } else {
      result[key] = convertVariablesFormat(value);
    }
  }

  return result;
}

// TODO: Types are not correctly converted
export function convertYamlFormat(input: string): string {
  const parsedYaml = yaml.load(input) as GenericObject;
  const convertedYaml = convertVariablesFormat(parsedYaml);
  return yaml.dump(convertedYaml, { quotingType: '"' }).trimEnd();
}

interface EnumField {
  fieldName: string;
  enumValues: string[];
  type?: string;
}

function addEnumToFields(variables: any, fields: EnumField[]) {
  if (variables && variables.properties) {
    fields.forEach((field) => {
      if (variables.properties[field.fieldName]) {
        variables.properties[field.fieldName] = {
          ...variables.properties[field.fieldName],
          enum: field.enumValues,
          type: field.type || "string",
        };
      }
    });
  }
  return variables;
}

const variableFieldsToModify: EnumField[] = [
  {
    fieldName: "controller_flavor",
    enumValues: ["SCS-2V-4-20s", "SCS-2V-8-20s"],
    type: "string",
  },
  {
    fieldName: "worker_flavor",
    enumValues: ["SCS-2V-4-20s", "SCS-2V-8-20s"],
    type: "string",
  },
  {
    fieldName: "apiserver_loadbalancer",
    enumValues: ["none", "octavia-amphora", "octavia-ovn", "kube-vip"],
    type: "string",
  },
  {
    fieldName: "workload_loadbalancer",
    enumValues: ["none", "octavia-amphora", "octavia-ovn", "yawol"],
    type: "string",
  },
  {
    fieldName: "version",
    enumValues: ["none", "octavia-amphora", "octavia-ovn", "yawol"],
    type: "string",
  },
];

export function modifySchemas(
  definitions: object[],
  fieldsToModify: EnumField[] = variableFieldsToModify,
) {
  return updateArrayObjects(
    definitions,
    "properties.spec.properties.topology.properties.variables",
    (variables, key) => {
      const transformedVariables = transformDataStructure(variables.items);
      return addEnumToFields(transformedVariables, fieldsToModify);
    },
  );
}
