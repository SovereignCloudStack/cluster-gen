import {
  RJSFSchema,
  UiSchema,
  FieldProps,
  RegistryFieldsType,
} from "@rjsf/utils";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

export default class version extends React.Component<FieldProps> {
  constructor(props: FieldProps) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name: string) {
    return (event: any) => {
      this.setState(
        {
          [name]: "v" + event,
        },
        () => this.props.onChange(this.state),
      );
    };
  }

  render() {
    const k8s_versions = {
      "1.30": ["1.30.3", "1.30.2", "1.30.1", "1.30.0"],
      "1.29": [
        "1.29.6",
        "1.29.5",
        "1.29.4",
        "1.29.3",
        "1.29.2",
        "1.29.1",
        "1.29.0",
      ],
      "1.28": [
        "1.28.11",
        "1.28.10",
        "1.28.9",
        "1.28.8",
        "1.28.7",
        "1.28.6",
        "1.28.5",
        "1.28.4",
        "1.28.3",
        "1.28.2",
        "1.28.1",
        "1.28.0",
      ],
    };

    return (
      <>
        <label className="text-m font-medium leading-none tracking-tight mb-4 inline-block">
          Kubernetes version
        </label>
        <Select onValueChange={this.onChange("version")} defaultValue="1.29.3">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>1.30</SelectLabel>
              {k8s_versions["1.30"].map((item) => (
                <SelectItem
                  key={item}
                  value={item.toString()}
                  defaultValue="1.30.3"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>1.29</SelectLabel>
              {k8s_versions["1.29"].map((item) => (
                <SelectItem
                  key={item}
                  value={item.toString()}
                  defaultValue="1.29.6"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>1.28</SelectLabel>
              {k8s_versions["1.28"].map((item) => (
                <SelectItem
                  key={item}
                  value={item.toString()}
                  defaultValue="1.28.11"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-2">
          Select which Kubernetes minor version you want
        </p>
      </>
    );
  }
}
