"use client";

import { useState } from "react";
import React from "react";
import validator from "@rjsf/validator-ajv8";
import { stringify } from "yaml";
import SyntaxHighlighter from "react-syntax-highlighter";
import { UiSchema, FieldProps, RegistryFieldsType } from "@rjsf/utils";

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
import { Form } from "@/components/form/custom";
import { MultiInput } from "@/components/form/multi-input";
import { ClusterGroup } from "@/components/form/fields";
import { DownloadButton } from "@/components/form/download-button";


export const ClusterForm = (schema: any) => {

  const clusterstacks = schema?.schema.clusterstacks
  const schemas = schema?.schema.definitions

  console.log(clusterstacks)

  const [formData, setFormData] = useState(null);

  const schemaObject = schema?.schema.definitions[7];

  const uiSchema: UiSchema = {
    "ui:field": "geo",
    kind: { "ui:widget": "hidden" },
    apiVersion: { "ui:widget": "hidden" },
    metadata: { labels: { "ui:widget": "hidden" } },
    spec: {
      clusterNetwork: { "ui:widget": "hidden" },
      topology: {
        workers: {
          machineDeployments: { failureDomain: { "ui:widget": "hidden" } },
        },
      },
    },
  };

  const yaml_out = stringify(formData).trimEnd(); // json to yaml conversion

  // const [values, setValues] = useState<string[]>([]);
  const fields: RegistryFieldsType = { geo: ClusterGroup };

  return (
    <>
      <div className="flex space-x-8 mt-8">
        <div className="grid grid-row-cols grid-cols-2 gap-12 mb-4">
          <div className="">
            <Card>
              <CardHeader>
                <CardTitle className="">Cluster</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Form
                    noHtml5Validate
                    schema={schemaObject}
                    uiSchema={uiSchema}
                    formData={formData}
                    validator={validator}
                    // fields={fields}
                    widgets={widgets}
                    onChange={(e) => setFormData(e.formData)}
                  />
                  {/* <MultiInput value={values} onchange={setValues} /> */}
                </div>
              </CardContent>
            </Card>
          </div>
          <SyntaxHighlighter
            language="yaml"
            className="text-sm w-1/2"
            style={{
              "hljs-attr": {
                color: "hsl(var(--foreground))",
              },
              "react-syntax-highlighter-line-number": {
                color: "rgb(183 183 183)",
                margin: "0",
              },
            }}
            showLineNumbers={true}
            customStyle={{
              backgroundColor: "var(--primary-color)",
              color: "#0F5FE1",
            }}
          >
            {yaml_out}
          </SyntaxHighlighter>
        </div>
      </div>
    </>
  );
};
