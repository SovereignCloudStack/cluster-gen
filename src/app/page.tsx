export const revalidate = 1800; // revalidate every 30mins

import sortJson from "sort-json";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

import { FullForm } from "@/components/form/form";

async function getClusterClasses() {
  try {
    const res = await fetch(
      "https://capi-jsgen.moin.k8s.scs.community/namespaces",
    ).then((response) => response.json());
    const clusterstacks = res["kaas-playground0"];

    const unsorted = await Promise.all(
      clusterstacks.map((stack: any) =>
        fetch(
          `https://capi-jsgen.moin.k8s.scs.community/clusterschema/kaas-playground0/` +
            stack,
        ).then((response) => response.json()),
      ),
    );

    const options = { ignoreCase: true, reverse: false, depth: 2 };
    const definitions = unsorted.map((stack: any) => sortJson(stack, options));
    const schema = Object.fromEntries(
      clusterstacks.map((key: string, i: number) => [key, definitions[i]]),
    );

    return schema;
  } catch (error) {
    console.error("runtime error: ", error);
  }
}

export default async function IndexPage() {
  const schema = await getClusterClasses();

  return (
    <div className="container max-w-4xl relative">
      <PageHeader>
        <PageHeaderHeading>Cluster Gen</PageHeaderHeading>
        <PageHeaderDescription>
          Generate ready to deploy Cluster objects based on Cluster Stacks
        </PageHeaderDescription>
        <PageActions>
          <FullForm schema={schema} />
        </PageActions>
      </PageHeader>
    </div>
  );
}
