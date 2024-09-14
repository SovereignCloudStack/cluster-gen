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
import { removeVariables } from "@/lib/utils";

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

export const ClusterForm = (props: any) => {
  const cluster_schema = props?.schema;
  const [formData, setFormData] = props?.functions;

  const modifiedSchema = removeVariables(cluster_schema);

  console.log(
    "here:",
    modifiedSchema.properties.spec.properties.clusterNetwork.properties.services
      .properties.cidrBlocks,
  );

  // custom field component
  const fields: RegistryFieldsType = { k8s_version: version };

  return (
    <>
      <div className="space-x-8 mt-6">
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
