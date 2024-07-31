import {
  RJSFSchema,
  UiSchema,
  FieldProps,
  RegistryFieldsType,
} from "@rjsf/utils";
import React from "react";

import SelectWidget from "@/components/form/custom/SelectWidget";

export class ClusterGroup extends React.Component<FieldProps> {
  constructor(props: FieldProps) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name: any) {
    return (event: any) => {
      this.setState(
        {
          [name]: parseFloat(event.target.value),
        },
        () => this.props.onChange(this.state),
      );
    };
  }

  render() {
    //@ts-ignore
    const { lat, lon } = this.state;
    return (
      <div>
        <input type="number" value={lat} onChange={this.onChange("lat")} />
      </div>
    );
  }
}
