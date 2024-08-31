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

import { ClusterForm } from "@/components/form/cluster";
import { VariablesForm } from "@/components/form/variables";

export const FullForm = (schema: any) => {
  const schemas = schema?.schema;
  const list = Object.keys(schemas).reverse();

  const [clusterstack, setClusterStack] = useState("openstack-scs-1-30-v1");
  const [formData, setFormData] = useState(null);
  const [formData2, setFormData2] = useState(null);

  const [activeSchema, setActiveSchema] = useState(schemas[clusterstack]);

  const handleSwitch = (value: string) => {
    setClusterStack(value);
    setFormData(schemas[value]);
    setActiveSchema(schemas[value]);
  };

  const yaml_out = stringify(formData).trimEnd(); // json to yaml conversion

  return (
    <>
      <div className="flex space-x-8 mt-8">
        <div className="grid grid-row-cols grid-cols-2 gap-12 mb-4">
          <div className="">
            <Card>
              <CardHeader>
                <CardTitle className="">Cluster Stack</CardTitle>
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
                        defaultValue="openstack-scs-1-30-v1"
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
            <ClusterForm
              schema={schemas[clusterstack]}
              functions={[formData, setFormData]}
            />
            <VariablesForm
              schema={schemas[clusterstack]}
              functions={[formData2, setFormData2]}
            />
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
