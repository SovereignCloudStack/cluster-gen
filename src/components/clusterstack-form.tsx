"use client"

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { DownloadButton } from './download-button';

export function ClusterStackForm() {

  const FormSchema = z.object({
    clusterstack_name: z.string().min(2, {
      message: "Cluster Stack name must be at least 2 characters.",
    }),
    namespace: z.string().min(2, {
      message: "Namespace must be at least 2 characters.",
    }),
    clusterstack: z.string().min(2, {
      message: "Required",
    }),
    cloud_name: z.string().min(2, {
      message: "Cloud name must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clusterstack: "openstack-alpha-1-29-v2",
      clusterstack_name: "",
      namespace: "",
      cloud_name: "openstack",
    },
  });

  const ready = form.formState.isValid

  const kubernetesVersion = form.watch("clusterstack").split("-")[2] + "." + form.watch("clusterstack").split("-")[3]

  const resource = 'apiVersion: clusterstack.x-k8s.io/v1alpha1\n' +
    'kind: ClusterStack\n' +
    'metadata:\n' +
    '  name: ' + form.watch("clusterstack_name") + '\n' +
    '  namespace: ' + form.watch("namespace") + '\n' +
    'spec:\n' +
    '  provider: ' + "openstack" + '\n' +
    '  name: ' + form.watch("clusterstack").split("-")[1] + '\n' +
    '  kubernetesVersion: ' + '"' + kubernetesVersion + '"' + '\n' +
    '  channel: ' + "stable" + '\n' +
    '  autoSubscribe: ' + "false" + '\n' +
    '  providerRef:\n' +
    '    apiVersion: ' + "infrastructure.clusterstack.x-k8s.io/v1alph1" + '\n' +
    '    kind: ' + "OpenStackClusterStackReleaseTemplate" + '\n' +
    '    name: ' + "cspotemplate" + '\n' +
    '  versions:\n' +
    '     - ' + form.watch("clusterstack").split("-")[4] + '\n' +
    '--- \n' +
    'apiVersion: infrastructure.clusterstack.x-k8s.io/v1alpha1\n' +
    'kind: OpenstackClusterStackReleaseTemplate \n' +
    'metadata:\n' +
    '  name: ' + "cspotemplate" + '\n' +
    '  namespace: ' + form.watch("namespace") + '\n' +
    'spec:\n' +
    '  template:\n' +
    '    spec:\n' +
    '      identityRef:\n' +
    '        kind: ' + "Secret" + '\n' +
    '        name: ' + form.watch("cloud_name")

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(resource)
  }

  return (
    <>
      <div className="flex space-x-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/2">
            <FormField
              control={form.control}
              name="clusterstack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-m">Cluster Stack</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>1.30</SelectLabel>
                        <SelectItem value="openstack-alpha-1-30-v2">
                          openstack-alpha-1-30-v2
                        </SelectItem>
                        <SelectItem value="openstack-alpha-1-30-v1">
                          openstack-alpha-1-30-v1
                        </SelectItem>
                        <SelectItem value="openstack-kamaji-1-30-v0-sha-11930ee">
                          openstack-kamaji-1-30-v0-sha-11930ee
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>1.29</SelectLabel>
                        <SelectItem value="openstack-alpha-1-29-v3">
                          openstack-alpha-1-29-v3
                        </SelectItem>
                        <SelectItem value="openstack-alpha-1-29-v2">
                          openstack-alpha-1-29-v2
                        </SelectItem>
                        <SelectItem value="openstack-alpha-1-29-v1">
                          openstack-alpha-1-29-v1
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>1.28</SelectLabel>
                        <SelectItem value="openstack-scs-1-28-v1">
                          openstack-scs-1-28-v1
                        </SelectItem>
                        <SelectItem value="openstack-alpha-1-28-v4">
                          openstack-alpha-1-28-v4
                        </SelectItem>
                        <SelectItem value="openstack-alpha-1-28-v1">
                          openstack-alpha-1-28-v3
                        </SelectItem>
                        <SelectItem value="metal3-alpha-1-28-v0-sha-b699b93">
                          metal3-alpha-1-28-v0-sha-b699b93
                        </SelectItem>
                        <SelectItem value="metal3-alpha-1-28-v0-sha-b08777e">
                          metal3-alpha-1-28-v0-sha-b08777e
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>1.27</SelectLabel>
                        <SelectItem value="openstack-scs-1-27-v4">
                          openstack-scs-1-27-v4
                        </SelectItem>
                        <SelectItem value="openstack-scs-1-27-v3">
                          openstack-scs-1-27-v3
                        </SelectItem>
                        <SelectItem value="openstack-scs-1-27-v2">
                          openstack-scs-1-27-v2
                        </SelectItem>
                        <SelectItem value="openstack-alpha-1-27-v1">
                          openstack-alpha-1-27-v1
                        </SelectItem>
                        <SelectItem value="openstack-wooctavia-1-27-v1">
                          openstack-wooctavia-1-27-v1
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select which Cluster Stack to use
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clusterstack_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cluster Stack name</FormLabel>
                  <FormControl>
                    <Input placeholder="cs-cluster" {...field} />
                  </FormControl>
                  <FormDescription>Name of the Cluster Stack</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="namespace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namespace</FormLabel>
                  <FormControl>
                    <Input placeholder="my-tenant" {...field} />
                  </FormControl>
                  <FormDescription>
                    Namespace in which to deploy the Cluster Stack
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cloud_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cloud name</FormLabel>
                  <FormControl>
                    <Input placeholder="openstack" {...field} />
                  </FormControl>
                  <FormDescription>As defined in your clouds.yaml</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DownloadButton ready={ready} resource={resource} />
          </form>
        </Form>
        <SyntaxHighlighter
          language="yaml"
          className="w-1/2 text-sm"
          style={{
            "hljs-attr": {
              color: "hsl(var(--foreground))"
            },
            "react-syntax-highlighter-line-number": {
              color: "#a7a7a7",
              margin: "0"
            }
          }}
          showLineNumbers={true}
          customStyle={{
            backgroundColor: "var(--primary-color)",
            color: "#0F5FE1",
          }}
        >
          {resource}
        </SyntaxHighlighter>
      </div>
    </>
  );
}
