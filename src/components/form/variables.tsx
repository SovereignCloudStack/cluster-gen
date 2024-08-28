"use client";

import { useState } from "react";
import React from "react";
import validator from "@rjsf/validator-ajv8";
import { stringify } from "yaml";
import SyntaxHighlighter from "react-syntax-highlighter";

import SubmitButton from "./custom/SubmitButton";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { widgets } from "@/components/form/widgets";
import { Form as RJSForm } from "@/components/form/custom";
import { MultiInput } from "@/components/form/multi-input";
import { DownloadButton } from "@/components/form/download-button";
import {
  UiSchema,
  RJSFSchema,
  FieldProps,
  RegistryFieldsType,
} from "@rjsf/utils";
import version from "@/components/form/fields";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

import { getDefaultRegistry } from "@rjsf/core";
import { ObjectFieldTemplateProps } from "@rjsf/utils";

const uiSchema: UiSchema = {
  external_id: { "ui:widget": "hidden" },
  controller_root_disk: {
    "ui:title": "Controller Disk Size",
    "ui:description": "Root disk size in GiB for control-plane nodes",
  },
  worker_root_disk: {
    "ui:title": "Worker Disk Size",
    "ui:description": "Root disk size in GiB for worker nodes",
  },
  ssh_key: {
    "ui:title": "SSH Key",
    "ui:description": "The SSH key to inject in the nodes",
  },
  node_cidr: {
    "ui:title": "Node CIDR",
    "ui:description": "NodeCIDR is the OpenStack Subnet to be created",
  },
  apiserver_loadbalancer: {
    "ui:title": "Apiserver Loadbalancer",
    "ui:description":
      "Configure the loadbalancer that is placed in front of the apiserver",
  },
  workload_loadbalancer: {
    "ui:title": "Workload Loadbalancer",
    "ui:description":
      "Configure the loadbalancer solution for your services inside your cluster.",
  },
};

const registry = getDefaultRegistry();

const ObjectFieldTemplate = registry.templates.ObjectFieldTemplate;

export const VariablesForm = (schema: any) => {
  const schema_variables = schema?.schema;
  const list = Object.keys(schema_variables).reverse();

  const variables =
    schema_variables.properties.spec.properties.topology.properties.variables;

  function transformData(input: any): any {
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

  function formatTitle(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const transformed = transformData(variables);
  //console.log(JSON.stringify(transformed, null, 2));

  const [clusterstack, setClusterStack] = useState("openstack-scs-1-30-v1");
  const [formData, setFormData] = useState(null);
  const [activeSchema, setActiveSchema] = useState(transformed);

  const handleSwitch = (value: string) => {
    setClusterStack(value);
    setFormData(schemas[value]);
    setActiveSchema(schemas[value]);
  };

  const yaml_out = stringify(formData).trimEnd(); // json to yaml conversion

  return (
    <>
      <div className="space-x-8 mt-8">
        <div className="mb-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="">Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RJSForm
                  schema={transformed}
                  uiSchema={uiSchema}
                  //formData={formData}
                  validator={validator}
                  // fields={fields}
                  widgets={widgets}
                  onChange={(e) => setFormData(e.formData)}
                  templates={{
                    ButtonTemplates: { SubmitButton },
                  }}
                >
                  {/*<DownloadButton formStatus={validator} formData={formData}/> */}
                </RJSForm>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
