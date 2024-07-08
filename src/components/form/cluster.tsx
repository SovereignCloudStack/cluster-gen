"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SyntaxHighlighter from 'react-syntax-highlighter';

import { Separator } from "@/components/ui/separator"

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

import { DownloadButton } from '@/components/form/download-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { widgets } from "@/components/form/widgets"
import Form from '@rjsf/core';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

import validator from '@rjsf/validator-ajv8';
import { parse, stringify } from 'yaml'
import { useState } from "react";

import { MultiInput } from "@/components/multi-input"

export const ClusterForm = (schema: Object) => {
  const [values, setValues] = useState<string[]>([])
  const out = stringify(schema)
  console.log(out)
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
                <pre>{JSON.stringify(schema.schema, null, 2)}</pre>
                <Form
                  schema={schema.schema}
                  validator={validator}
                  widgets={widgets}
                />
                <MultiInput value={values} onChange={setValues} />

              </div>
            </CardContent>
          </Card>
        </div>
      </div >
    </>
  );
}
