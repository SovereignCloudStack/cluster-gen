export const revalidate = 900; // revalidate every 15mins

import { promises as fs } from "fs";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

import { ClusterForm } from "@/components/form/cluster";

async function getClusterClasses() {
  const res = await fetch(
    "http://localhost:8080/clusterschema/kaas-playground0/openstack-alpha-1-28-v4",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function IndexPage() {
  const file = await fs.readFile(
    process.cwd() + "/public/clusterschema.json",
    "utf8",
  );
  const schema = JSON.parse(file);
  const schema2 = await getClusterClasses();

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>Cluster Gen</PageHeaderHeading>
        <PageHeaderDescription>
          Generate Cluster objects based on SCS Cluster Stacks
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
