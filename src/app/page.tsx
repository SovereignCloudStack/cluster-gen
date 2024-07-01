export const revalidate = 900; // revalidate at most every 15mins

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

import { ClusterForm } from "@/components/cluster-form";

async function getClusterClasses() {
  const res = await fetch(
    "https://moin.k8s.scs.community/apis/cluster.x-k8s.io/v1beta1/clusterclasses",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function IndexPage() {
  const data = await getClusterClasses();
  const ccs = data?.items;

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>Cluster Gen</PageHeaderHeading>
        <PageHeaderDescription>
          Generate Cluster objects based on SCS Cluster Stacks
        </PageHeaderDescription>
        <PageActions>
          <div className="mt-14">
            <ClusterForm ccs={ccs} />
          </div>
        </PageActions>
      </PageHeader>
    </div>
  );
}
