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
import { transformVariables } from "@/lib/utils";
import { formatTitle } from "@/lib/utils";

import { transformDataStructure } from "@/lib/utils";

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
    "ui:title": "API Server Loadbalancer",
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

export const VariablesForm = (props: any) => {
  const variables_schema = props?.schema;
  const list = Object.keys(variables_schema).reverse();

  const variables =
    variables_schema.properties.spec.properties.topology.properties.variables;

  const transformed = transformVariables(variables);


  const transformedData = transformDataStructure(variables.items);
  console.log("transformed:", transformedData)






  const [clusterstack, setClusterStack] = useState("openstack-scs-1-30-v1");
  const [formData, setFormData] = useState(null);
  const [activeSchema, setActiveSchema] = useState(transformed);

  const yaml_out = stringify(formData).trimEnd(); // json to yaml conversion

  return (
    <>
      <div className="space-x-8 mt-6">
        <div className="mb-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="">Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RJSForm
                  schema={transformedData}
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
