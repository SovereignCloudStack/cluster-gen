"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";

export function DownloadButton(obj: any) {
  const linkRef = useRef(null);
  const handleDownload = async () => {
    if (obj.ready === true) {
      const blob = new Blob([obj.resource], {
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
    }
  };

  return (
    <a ref={linkRef}>
      <Button type="submit" onClick={handleDownload} className="mt-8 mr-4">
        Download
      </Button>
    </a>
  );
}
