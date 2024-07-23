export const revalidate = 900; // revalidate every 15mins

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

import { ClusterForm } from "@/components/form/clusterform";

async function getClusterClasses() {
  const res = await fetch(
    "https://capi-jsgen.moin.k8s.scs.community/namespaces",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}


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
  const namespaces = await getClusterClasses();
  const schema = await getDefinitions();


  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>Cluster Gen</PageHeaderHeading>
        <PageHeaderDescription>
          Generate ready to deploy Cluster objects based on Cluster Stacks
        </PageHeaderDescription>
        <PageActions>
          <div className="mt-8">
            <ClusterForm schema={schema} />
          </div>
        </PageActions>
      </PageHeader>
    </div>
  );
}
