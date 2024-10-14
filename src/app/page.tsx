export const revalidate = 1800; // revalidate every 30mins

import sortJson from "sort-json";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { ClusterForm } from "@/components/form/form";

import { modifySchemas } from "@/lib/utils";

async function getClusterClasses() {
  try {
    const res: { [key: string]: string[] } = await fetch(
      process.env.API_URL + "/namespaces",
    ).then((response) => response.json());
    const clusterstacks: string[] = res["kaas-playground0"];

    const getAll: any[] = await Promise.all(
      clusterstacks.map((stack: any) =>
        fetch(
          process.env.API_URL + "/clusterschema/kaas-playground0/" + stack,
        ).then((response) => response.json()),
      ),
    );

    const options = { ignoreCase: true, reverse: false, depth: 2 };

    const definitions: Record<string, any>[] = modifySchemas(
      getAll.map((stack: any) => sortJson(stack, options)),
    );
    const schemas: Record<string, Record<string, any>> = Object.fromEntries(
      clusterstacks.map((key: string, i: number) => [key, definitions[i]]),
    );

    return schemas;
  } catch (error) {
    throw new Error("Failed to fetch cluster schemas");
  }
}

export default async function IndexPage() {
  const schemas: Record<
    string,
    Record<string, any>
  > = await getClusterClasses();

  return (
    <div className="container max-w-4xl relative">
      <PageHeader>
        <PageHeaderHeading>Cluster Gen</PageHeaderHeading>
        <PageHeaderDescription>
          Generate ready to deploy Cluster objects based on Cluster Stacks
        </PageHeaderDescription>
        <PageActions>
          <ClusterForm schemas={schemas} />
        </PageActions>
      </PageHeader>
    </div>
  );
}
