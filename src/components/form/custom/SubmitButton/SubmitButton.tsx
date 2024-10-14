import { useRef } from "react";

import {
  FormContextType,
  getSubmitButtonOptions,
  RJSFSchema,
  StrictRJSFSchema,
  SubmitButtonProps,
} from "@rjsf/utils";

import { Button } from "@/components/ui/button";

export default function SubmitButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: SubmitButtonProps<T, S, F>) {
  const {
    submitText,
    norender,
    props: submitButtonProps,
  } = getSubmitButtonOptions<T, S, F>(props.uiSchema);

  const { uiSchema } = props;

  if (norender) {
    return null;
  }

  const linkRef = useRef(null);

  const handleDownload = async () => {
    const test = ["1"];
    const blob = new Blob(test, {
      type: "application/yaml",
    });
    const url = window.URL.createObjectURL(blob);
    const link = linkRef.current as HTMLAnchorElement | null;

    if (!link) {
      return;
    }

    link.href = url;
    link.download = "cluster.yaml";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <a ref={linkRef}>
        <Button type="submit" {...submitButtonProps} onClick={handleDownload}>
          Download
        </Button>
      </a>
    </div>
  );
}
