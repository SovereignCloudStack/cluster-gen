"use client";

import { useState } from "react";
import validator from "@rjsf/validator-ajv8";
import { stringify } from "yaml";
import SyntaxHighlighter from "react-syntax-highlighter";
import { UiSchema } from "@rjsf/utils";

import { Separator } from "@/components/ui/separator";
import { DownloadButton } from "@/components/form/download-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { widgets } from "@/components/form/widgets";
import RJSForm from "@/components/form/custom";
import { MultiInput } from "@/components/form/multi-input";

export const ClusterForm = (schema: any) => {
  const [formData, setFormData] = useState(null);
  const [values, setValues] = useState<string[]>([]);
  const schemaObject = schema?.schema;

  const uiSchema: UiSchema = {
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

  const yaml_out = stringify(formData);

  return (
    <>
      <div className="flex space-x-8">
        <div className="grid grid-row-cols grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle className="">Cluster</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <RJSForm
                  noHtml5Validate
                  schema={schemaObject}
                  uiSchema={uiSchema}
                  formData={formData}
                  validator={validator}
                  widgets={widgets}
                  onChange={(e) => setFormData(e.formData)}
                />
                {/* <MultiInput value={values} onchange={setValues} /> */}
              </div>
            </CardContent>
          </Card>
          <SyntaxHighlighter
            language="json"
            className="w-1/2 text-sm"
            style={{
              "hljs-attr": {
                color: "hsl(var(--foreground))",
              },
              "react-syntax-highlighter-line-number": {
                color: "#a7a7a7",
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
