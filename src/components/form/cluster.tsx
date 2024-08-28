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

const uiSchema: UiSchema = {
  kind: { "ui:widget": "hidden" },
  apiVersion: { "ui:widget": "hidden" },
  metadata: {
    name: {
      "ui:title": "Cluster name",
      "ui:description": "Name of your Cluster",
    },
    namespace: {
      "ui:description": "Namespace in which to deploy the Cluster",
    },
    labels: { "ui:widget": "hidden" },
  },
  spec: {
    clusterNetwork: {
      serviceDomain: { "ui:widget": "hidden" },
      services: {
        cidrBlocks: {
          items: {
            "ui:title": "Service CIDRs",
            "ui:description": "CIDR addresses for all services in the cluster",
          },
        },
      },
      pods: {
        cidrBlocks: {
          items: {
            "ui:title": "Pod CIDRs",
            "ui:description": "CIDR addresses for all pods in the cluster",
          },
        },
      },
    },
    topology: {
      class: { "ui:widget": "hidden" },
      version: {
        "ui:title": "Kubernetes version",
        "ui:description": "Select which Kubernetes minor version you want",
        "ui:field": "k8s_version",
      },
      controlPlane: {
        replicas: {
          "ui:title": "Control plane replicas",
          "ui:description": "How many control plane replicas you want",
          "ui:widget": "updown",
        },
      },
      workers: {
        machineDeployments: {
          items: {
            name: { "ui:widget": "hidden" },
            failureDomain: { "ui:widget": "hidden" },
            class: { "ui:widget": "hidden" },
            replicas: {
              "ui:title": "Worker replicas",
              "ui:description": "How many worker replicas you want",
              "ui:widget": "updown",
            },
          },
        },
      },
    },
  },
};

export const ClusterForm = (schema: any) => {
  const cluster_schema = schema?.schema;
  const list = Object.keys(cluster_schema).reverse();
  //console.log(schema)

  function removeVariables(schema: any) {
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

  const modifiedSchema = removeVariables(cluster_schema);

  // Define the custom field components to register; here our "geo"
  // custom field component
  const fields: RegistryFieldsType = { k8s_version: version };

  const [clusterstack, setClusterStack] = useState("openstack-scs-1-30-v1");
  const [formData, setFormData] = useState(null);
  const [activeSchema, setActiveSchema] = useState(
    cluster_schema[clusterstack],
  );

  const handleSwitch = (value: string) => {
    setClusterStack(value);
    setFormData(schemas[value]);
    setActiveSchema(schemas[value]);
  };

  const yaml_out = stringify(formData).trimEnd(); // json to yaml conversion

  return (
    <>
      <div className="space-x-8 mt-8">
        <div className=" mb-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="">Cluster</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RJSForm
                  schema={modifiedSchema}
                  uiSchema={uiSchema}
                  //formData={formData}
                  validator={validator}
                  fields={fields}
                  widgets={widgets}
                  onChange={(e) => setFormData(e.formData)}
                  templates={{
                    ButtonTemplates: { SubmitButton },
                    //ObjectFieldTemplate: ObjectFieldTemplateWrapper,
                  }}
                >
                  {/*<DownloadButton formStatus={validator} formData={formData}/> */}
                </RJSForm>
              </CardContent>
            </Card>
            {/* <MultiInput value={values} onchange={setValues} /> */}
          </div>
        </div>
      </div>
    </>
  );
};
