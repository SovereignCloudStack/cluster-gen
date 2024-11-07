"use client";

import { useState, createRef } from "react";
import React from "react";
import validator from "@rjsf/validator-ajv8";
import { getDefaultRegistry } from "@rjsf/core";
import { ObjectFieldTemplateProps } from "@rjsf/utils";
import { stringify } from "yaml";
import SyntaxHighlighter from "react-syntax-highlighter";

import { convertYamlFormat } from "@/lib/utils";
import uiSchema from "@/components/form/uischema";
import SubmitButton from "@/components/form/custom/SubmitButton/SubmitButton";
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
import { DownloadButton } from "@/components/form/download-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

export const ClusterForm = (schemas: any) => {
  const schema = schemas?.schemas;
  const list = Object.keys(schema).reverse();

  const [clusterstack, setClusterStack] = useState(list[0]);
  const [formData, setFormData] = useState(null);

  const handleSwitch = (value: string) => {
    setClusterStack(value);
    setFormData(schema[value]);
  };

  const yaml_out = convertYamlFormat(stringify(formData))
    .split("additionalProperties: false")
    .slice(0, 1)[0]
    .trimEnd();

  const onSubmit = (data: any, e: React.FormEvent) => {
    const yamlData = JSON.parse(JSON.stringify(data.formData));
    const clusterName = yamlData.metadata?.name || "cluster";
    const blob = new Blob([yaml_out], { type: "application/yaml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${clusterName}.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex space-x-8 mt-8">
        <div className="grid grid-row-cols grid-cols-2 gap-12 mb-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cluster Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  onValueChange={(value) => handleSwitch(value)}
                  defaultValue={clusterstack}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {list.map((item) => (
                      <SelectItem
                        key={item}
                        value={item.toString()}
                        defaultValue={list[0]}
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Select which Cluster Stack to use
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cluster</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RJSForm
                  schema={schema[clusterstack]}
                  uiSchema={uiSchema}
                  validator={validator}
                  //liveValidate={true}
                  widgets={widgets}
                  formData={formData}
                  onChange={(e: any) => setFormData(e.formData)}
                  onSubmit={onSubmit}
                  templates={{ ButtonTemplates: { SubmitButton } }}
                ></RJSForm>
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
