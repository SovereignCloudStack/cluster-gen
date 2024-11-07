export const revalidate = 900; // revalidate every 15mins

import sortJson from "sort-json";

import { modifySchemas } from "@/lib/utils";
import { auth } from "@/app/auth";
import type { DexSession } from "@/lib/types";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { ClusterForm } from "@/components/form/form";

async function getClusterClasses() {
  try {
    const res: { [key: string]: string[] } = await fetch(
      process.env.API_URL + "/namespaces",
    ).then((response) => response.json());
    const clusterstacks: string[] = res["kaas-playground1"];

    const getAll: any[] = await Promise.all(
      clusterstacks.map((stack: any) =>
        fetch(
          process.env.API_URL + "/clusterschema/kaas-playground1/" + stack,
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
    throw new Error("Failed to fetch and parse cluster schemas");
  }
}

export default async function IndexPage() {
  const schemas: Record<
    string,
    Record<string, any>
  > = await getClusterClasses();
  const session = (await auth()) as DexSession;

  if (session?.user) {
    session.user = {
      username: session?.profile?.preferred_username,
      name: session.user.name,
      groups: session.profile?.groups,
    };
    delete session.profile;
  }

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
