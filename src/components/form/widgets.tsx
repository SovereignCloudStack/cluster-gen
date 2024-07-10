"use client";

import { RegistryWidgetsType, WidgetProps } from "@rjsf/utils";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import MultiInput from "@/components/form/multi-input";
import { useState } from "react";

export const widgets: RegistryWidgetsType = {
  CheckboxWidget: function (props: WidgetProps) {
    return <Checkbox checked={props.value} onChange={props.onChange} />;
  },
  TextWidget: function (props: WidgetProps) {
    return (
      <Input
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
      />
    );
  },
  NumberWidget: function (props: WidgetProps) {
    return (
      <Input
        type="number"
        min={1}
        max={20}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
      />
    );
  },
  MultiInputWidget: function (props: WidgetProps) {
    const [values, setValues] = useState<string[]>([]);
    return <MultiInput value={values} onchange={setValues} />;
  },
};