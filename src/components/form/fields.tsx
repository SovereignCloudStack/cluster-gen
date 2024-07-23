 import { RJSFSchema, UiSchema, FieldProps, RegistryFieldsType } from '@rjsf/utils';
import React from 'react'; 
  
export class ClusterGroup extends React.Component<FieldProps> {
  constructor(props: FieldProps) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return (event) => {
      this.setState(
        {
          [name]: parseFloat(event.target.value),
        },
        () => this.props.onChange(this.state)
      );
    };
  }

  render() {
    const { lat, lon } = this.state;
    return (
      <div>
        <input type='number' value={lat} onChange={this.onChange('lat')} />
        <input type='number' value={lon} onChange={this.onChange('lon')} />
      </div>
    );
  }
}