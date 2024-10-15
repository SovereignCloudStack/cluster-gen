"use client";

import { useState } from "react";
import React from "react";
import validator from "@rjsf/validator-ajv8";
import { stringify } from "yaml";
import SyntaxHighlighter from "react-syntax-highlighter";

import SubmitButton from "@/components/form/custom/SubmitButton";

import uiSchema from "@/components/form/uischema";

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
//import { Form as RJSForm } from "@/components/form/rjsf";

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

import { convertYamlFormat } from "@/lib/utils";

export const ClusterForm = (schemas: any) => {
  const schema = schemas?.schemas;
  const list = Object.keys(schema).reverse();

  const [clusterstack, setClusterStack] = useState(list[0]);
  const [formData, setFormData] = useState(null);
  //const [activeSchema, setActiveSchema] = useState(schema[clusterstack]);

  const handleSwitch = (value: string) => {
    setClusterStack(value);
    setFormData(schema[value]);
    //setActiveSchema(schema[value]);
  };

  const yaml_out = convertYamlFormat(stringify(formData)); // json to yaml conversion

  // custom field component
  const fields: RegistryFieldsType = { k8s_version: version };

  // CUSTOM GROUPS (Cluster, Machines, Variables)
  const registry = getDefaultRegistry();
  const ObjectFieldTemplate = registry.templates.ObjectFieldTemplate;
  const groups = [
    {
      title: "cluster",
      fields: [
        "metadata.properties.name",
        "metadata.properties.namespace",
        "version",
      ],
    },
    //{ title: "machines", fields: "spec.variables" },
    { title: "variables", fields: "spec.variables" },
  ];

  const getPropsForGroup = (
    group: any,
    props: ObjectFieldTemplateProps,
  ): ObjectFieldTemplateProps => {
    2;
    console.log(props.properties);
    console.log(group.fields);
    console.log(props.properties.filter((p) => console.log(p)));

    // More filtering might be required for propper functionality, this is just a POC
    return {
      ...props,
      // properties: props.properties.filter((p) => group.fields.includes(p.name)),
    };
  };

  const ObjectFieldTemplateWrapper = (props: ObjectFieldTemplateProps) => {
    return (
      <>
        {groups.map((group) => {
          const childProps = getPropsForGroup(group, props);
          console.log(group);
          return (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="">
                    {group.title.charAt(0).toUpperCase() + group.title.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <ObjectFieldTemplate key={group.title} {...childProps} />
                  </div>
                </CardContent>
              </Card>
            </>
          );
        })}
      </>
    );
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
                  fields={fields}
                  widgets={widgets}
                  onChange={(e: any) => setFormData(e.formData)}
                  templates={{
                    ButtonTemplates: { SubmitButton },
                    //ObjectFieldTemplate: ObjectFieldTemplateWrapper,
                  }}
                >
                  {/*<DownloadButton formStatus={validator} formData={formData}/> */}
                </RJSForm>
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
