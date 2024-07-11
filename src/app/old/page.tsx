export const revalidate = 900; // revalidate every 15mins

import { promises as fs } from "fs";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

import { ClusterForm } from "@/components/form/cluster-old";

export default async function IndexPage() {
  const file = await fs.readFile(
    process.cwd() + "/public/clusterschema.json",
    "utf8",
  );
  const schema = JSON.parse(file);

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