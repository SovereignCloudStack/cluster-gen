import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ClusterStackForm } from "@/components/clusterstack-form";
import { ClusterForm } from "@/components/cluster-form";

export default function IndexPage() {
  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>Cluster Gen</PageHeaderHeading>
        <PageHeaderDescription>
          Generate Cluster objects based on SCS Cluster Stacks
        </PageHeaderDescription>
        <PageActions>
          <Tabs defaultValue="clusterstacks" className="w-[2000px] mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clusterstacks">Cluster Stack</TabsTrigger>
              <TabsTrigger value="cluster">Cluster</TabsTrigger>
            </TabsList>
            <div className="w-full space-x-8 mt-14">
              <TabsContent value="clusterstacks">
                <ClusterStackForm />
              </TabsContent>
              <TabsContent value="cluster">
                <ClusterForm />
              </TabsContent>
            </div>
          </Tabs>
        </PageActions>
      </PageHeader>
    </div>
  );
}
