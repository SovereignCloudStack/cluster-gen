"use client";

import { useRef } from "react";

import { stringify } from "yaml";
import {
  getSubmitButtonOptions,
  RJSFSchema,
  SubmitButtonProps,
} from "@rjsf/utils";

import { Button } from "@/components/ui/button";

export function DownloadButton(
  props: SubmitButtonProps,
  formData: any,
  formStatus: any,
) {
  const { uiSchema } = props;
  const { norender } = getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }
  const linkRef = useRef(null);
  const handleDownload = async () => {
    const yaml_out = stringify(formData.formData).trimEnd();
    const blob = new Blob([yaml_out], {
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
    <a ref={linkRef}>
      <Button type="submit" onClick={handleDownload} className="mt-8 mr-4">
        AHHHH
      </Button>
    </a>
  );
}
