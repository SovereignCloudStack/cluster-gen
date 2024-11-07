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
    ips: "IPs",
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
    return obj.map((item) => {
      if (typeof item === "string") {
        return isIpOrSubnet(item) ? item : `"${item}"`;
      }
      return convertVariablesFormat(item);
    });
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
        value: processValue(val),
      }));
    } else {
      result[key] = convertVariablesFormat(value);
    }
  }

  return result;
}

function processValue(val: any): any {
  if (typeof val === "string") {
    return isIpOrSubnet(val) ? val : `"${val}"`;
  }
  if (Array.isArray(val)) {
    return val.map((v) => processValue(v));
  }
  if (typeof val === "object" && val !== null) {
    const processed: GenericObject = {};
    for (const [k, v] of Object.entries(val)) {
      processed[k] = processValue(v);
    }
    return processed;
  }
  return val;
}

function isIpOrSubnet(str: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  const subnetRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  return ipv4Regex.test(str) || ipv6Regex.test(str) || subnetRegex.test(str);
}

export function convertYamlFormat(input: string): string {
  const parsedYaml = yaml.load(input) as GenericObject;
  const convertedYaml = convertVariablesFormat(parsedYaml);
  return yaml
    .dump(convertedYaml, {
      forceQuotes: false,
    })
    .trimEnd()
    .replace(/'/g, "");
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

const VariableFieldsToModify: EnumField[] = [
  {
    fieldName: "controller_flavor",
    enumValues: ["SCS-2V-4-20s", "SCS-2V-8-20s", "SCS-4V-8-20"],
    type: "string",
  },
  {
    fieldName: "worker_flavor",
    enumValues: [
      "SCS-2V-4",
      "SCS-2V-4-20",
      "SCS-2V-4-20s",
      "SCS-2V-8-20s",
      "SCS-4V-8-20",
    ],
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
];

const TopologyFieldsToModify: EnumField[] = [
  {
    fieldName: "version",
    enumValues: [
      "v1.29.3",
      "v1.30.0",
      "v1.30.1",
      "v1.30.2",
      "v1.30.3",
      "v1.30.4",
      "v1.30.5",
      "v1.31.0",
      "v1.31.1",
    ],
    type: "string",
  },
];

const MetadataFieldsToModify: EnumField[] = [
  {
    fieldName: "namespace",
    enumValues: [
      "kaas-playground0",
      "kaas-playground1",
      "kaas-playground2",
      "kaas-playground3",
      "kaas-playground4",
      "kaas-playground5",
      "kaas-playground6",
      "kaas-playground7",
      "kaas-playground8",
      "kaas-playground9",
    ],
    type: "string",
  },
];

function addEnumToTopologyFields(topology: any, fields: EnumField[]): any {
  fields.forEach((field) => {
    if (topology[field.fieldName]) {
      topology[field.fieldName] = {
        ...topology[field.fieldName],
        enum: field.enumValues,
        type: field.type || "string",
      };
    }
  });
  return topology;
}

export function modifySchemas(
  definitions: object[],
  variableFieldsToModify: EnumField[] = VariableFieldsToModify,
  topologyFieldsToModify: EnumField[] = TopologyFieldsToModify,
  metadataFieldsToModify: EnumField[] = MetadataFieldsToModify,
) {
  return definitions.map((definition) => {
    // Delete $id and $schema keys at the root of each schema as they for some reason cause issues with the validator
    delete (definition as any)["$id"];
    delete (definition as any)["$schema"];

    // Modify metadata fields
    if ((definition as any).properties.metadata) {
      (definition as any).properties.metadata = addEnumToFields(
        (definition as any).properties.metadata,
        metadataFieldsToModify,
      );
    }

    return updateArrayObjects(
      [definition],
      "properties.spec.properties",
      (spec, key) => {
        // Modify topology
        if (spec.topology) {
          spec.topology = updateArrayObjects(
            [spec.topology],
            "properties",
            (topology, key) => {
              // Modify variables
              if (topology.variables) {
                const transformedVariables = transformDataStructure(
                  topology.variables.items,
                );
                topology.variables = addEnumToFields(
                  transformedVariables,
                  variableFieldsToModify,
                );
              }

              // Modify topology fields
              topology = addEnumToTopologyFields(
                topology,
                topologyFieldsToModify,
              );

              return topology;
            },
          )[0];
        }

        return spec;
      },
    )[0];
  });
}
