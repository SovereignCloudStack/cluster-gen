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
  const items = data?.items;
  const out = items.map((item: any, index: any) => {
    return (
      <>
        <div key={index}>{item.metadata.name}</div>
      </>
    );
  });
  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>Cluster Gen</PageHeaderHeading>
        <PageHeaderDescription>
          Generate Cluster objects based on SCS Cluster Stacks
        </PageHeaderDescription>
        <PageActions>
          <div className="mt-14">
            <ClusterForm />
            {out}
          </div>
        </PageActions>
      </PageHeader>
    </div>
  );
}
