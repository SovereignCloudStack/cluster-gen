export const revalidate = 900; // revalidate every 15mins

import { promises as fs } from "fs";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

import { ClusterForm } from "@/components/form/cluster-old";

async function getDefinitions() {
  const res = await fetch(
    "https://capi-jsgen.moin.k8s.scs.community/clusterschema/kaas-playground0/openstack-scs-1-30-v1",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function IndexPage() {
  const data = await getDefinitions();

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>Cluster Gen</PageHeaderHeading>
        <PageHeaderDescription>
          Generate Cluster objects based on SCS Cluster Stacks
        </PageHeaderDescription>
        <PageActions>
          <div className="mt-8">
            <ClusterForm schema={data} />
          </div>
        </PageActions>
      </PageHeader>
    </div>
  );
}
