"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SyntaxHighlighter from 'react-syntax-highlighter';

import { Separator } from "@/components/ui/separator"

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

import { DownloadButton } from '@/components/form/download-button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { widgets } from "@/components/form/widgets"
import validator from '@rjsf/validator-ajv8';

export const ClusterForm = (schema: any) => {
    console.log(schema)
    const FormSchema = z.object({
        cluster_name: z.string().min(2, {
            message: "Cluster name must be at least 2 characters.",
        }),
        namespace: z.string().min(2, {
            message: "Namespace must be at least 2 characters.",
        }),
        clusterstack: z.string().min(2, {
            message: "Required",
        }),
        pod_cidr: z.string().min(2, {
            message: "Pod cidrs cannot be empty",
        }),
        service_cidr: z.string().min(2, {
            message: "Service cidrs cannot be empty",
        }),
        controller_flavor: z.string().min(2, {
            message: "Required",
        }),
        worker_flavor: z.string().min(2, {
            message: "Required",
        }),
        external_id: z.string().min(36, {
            message: "External network id cannot be empty",
        }),
        controlplane_replicas: z.coerce.number().min(1, {
            message: "Atleast 1 control plane replica is required",
        }),
        worker_replicas: z.coerce.number().min(1, {
            message: "Atleast 1 worker replica is required",
        }),
        kubernetes_version: z.string().min(2, {
            message: "Required",
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            clusterstack: "openstack-alpha-1-29-v2",
            cluster_name: "",
            namespace: "",
            kubernetes_version: "1.29.3",
            controller_flavor: "SCS-2V-4-20s",
            worker_flavor: "SCS-2V-4-20s",
            external_id: "ebfe5546-f09f-4f42-ab54-094e457d42ec",
            pod_cidr: "192.168.0.0/16",
            service_cidr: "10.96.0.0/12",
            controlplane_replicas: 2,
            worker_replicas: 4
        },
    });

    const ready = form.formState.isValid

    const resource = 'apiVersion: cluster.x-k8s.io/v1beta1\n' +
        'kind: Cluster\n' +
        'metadata:\n' +
        '  name: ' + form.watch("cluster_name") + '\n' +
        '  namespace: ' + form.watch("namespace") + '\n' +
        '  labels:\n' +
        '    managed-secret: cloud-config' + '\n' +
        'spec:\n' +
        '  clusterNetwork:\n' +
        '    pods:\n' +
        '      cidrBlocks:\n' +
        '        - ' + form.watch("pod_cidr") + '\n' +
        '    serviceDomain: cluster.local' + '\n' +
        '    services:\n' +
        '      cidrBlocks:\n' +
        '        - ' + form.watch("service_cidr") + '\n' +
        '  topology:\n' +
        '    variables:\n' +
        '      - name: controller_flavor' + '\n' +
        '        value: ' + '"' + form.watch("controller_flavor") + '"\n' +
        '      - name: worker_flavor' + '\n' +
        '        value: ' + '"' + form.watch("worker_flavor") + '"\n' +
        '      - name: external_id' + '\n' +
        '        value: ' + '"' + form.watch("external_id") + '"\n' +
        '    class: ' + form.watch("clusterstack") + '\n' +
        '    controlPlane:\n' +
        '      replicas: ' + form.watch("controlplane_replicas") + '\n' +
        '    version: v' + form.watch("kubernetes_version") + '\n' +
        '    workers:\n' +
        '      machineDeployments:\n' +
        '        - class: ' + form.watch("clusterstack") + '\n' +
        '          failureDomain: nova' + '\n' +
        '          name: ' + form.watch("clusterstack") + '\n' +
        '          replicas: ' + form.watch("worker_replicas")

    const k8s_versions = new Map([
        ["1.30", ["1.30.2", "1.30.1", "1.30.0"]],
        ["1.29", ["1.29.6", "1.29.5", "1.29.4", "1.29.3", "1.29.2", "1.29.1" + "1.29.0"]],
        ["1.28", ["1.28.11", "1.28.10", "1.28.9", "1.28.8", "1.28.7", "1.28.6", "1.28.5", "1.28.4", "1.28.3", "1.28.2", "1.28.1", "1.28.0"]]
    ])

    const options = () => {
        k8s_versions.forEach(function (element, index, array) {
            console.log(index, typeof (array))
        })
        return "lol"
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(resource)
    }

    return (
        <>
            <div className="flex space-x-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <div className="grid grid-row-cols grid-cols-2 gap-4 mb-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="">Cluster</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="cluster_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cluster name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="cs-cluster" {...field} />
                                                </FormControl>
                                                <FormDescription>Name of your Cluster</FormDescription>
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
                                                    Namespace in which to deploy the Cluster
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                        name="kubernetes_version"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-m">Kubernetes version</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Select which Kubernetes minor version you want
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                            <Card className="">
                                <CardHeader>
                                    <CardTitle className="">Machines</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-row gap-4">
                                        <div className="basis-3/4">
                                            <FormField
                                                control={form.control}
                                                name="controller_flavor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-m">Controller Flavor</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>1 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-1L-1">1 vCPU + 1GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-1L-1-5">1 vCPU + 1GiB RAM + 5GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-1V-2">1 vCPU + 2GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-1V-2-5">1 vCPU + 2GiB RAM + 5GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-1V-4">1 vCPU +4GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-1V-4-10">1 vCPU + 4GiB RAM + 10GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-1V-8">1 vCPU + 8GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-1V-8-20">1 vCPU + 8GiB RAM + 20GB Disk</SelectItem>
                                                                </SelectGroup>
                                                                <SelectGroup>
                                                                    <SelectLabel>2 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-2V-4">2 vCPU + 4GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-2V-4-10">2 vCPU + 4GiB RAM + 10GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-2V-4-20s">2 vCPU + 4GiB RAM + 20GB SSD</SelectItem>
                                                                    <SelectItem value="SCS-2V-8">2 vCPU + 8GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-2V-8-20">2 vCPU + 8GiB RAM + 20GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-2V-16">2 vCPU + 16GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-2V-16-50">2 vCPU + 16GiB RAM + 50GB Disk</SelectItem>
                                                                </SelectGroup>
                                                                <SelectGroup>
                                                                    <SelectLabel>4 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-4V-8">4 vCPU + 8GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-4V-8-20">4 vCPU + 8GiB RAM + 20GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-4V-16">4 vCPU + 16GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-4V-16-50">4 vCPU + 16GiB RAM + 50GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-4V-16-100s">4 vCPU + 16GiB RAM + 100GB SSD</SelectItem>
                                                                    <SelectItem value="SCS-4V-32">4 vCPU + 32GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-4V-32-100">4 vCPU + 32GiB RAM + 100GB Disk</SelectItem>
                                                                </SelectGroup>
                                                                <SelectGroup>
                                                                    <SelectLabel>8 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-8V-32">8 vCPU + 32GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-8V-32-100">8 vCPU + 32GiB RAM + 100GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-8V-16">8 vCPU + 16GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-8V-16-50">8 vCPU + 16GiB RAM + 50GB Disk</SelectItem>
                                                                </SelectGroup>
                                                                <SelectGroup>
                                                                    <SelectLabel>16 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-16V-32">16 vCPU + 32GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-16V-32-100">16 vCPU + 32GiB RAM + 100GB Disk</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>
                                                            Instance flavor of your control plane
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="basis-1/4">
                                            <FormField
                                                control={form.control}
                                                name="controlplane_replicas"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Replicas</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min={1} max={20} {...field} />
                                                        </FormControl>
                                                        <FormDescription>

                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex flex-row gap-4">
                                        <div className="basis-3/4">
                                            <FormField
                                                control={form.control}
                                                name="worker_flavor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-m">Worker Flavor</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>1 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-1L-1">1 vCPU + 1GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-1L-1-5">1 vCPU + 1GiB RAM + 5GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-1V-2">1 vCPU + 2GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-1V-2-5">1 vCPU + 2GiB RAM + 5GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-1V-4">1 vCPU +4GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-1V-4-10">1 vCPU + 4GiB RAM + 10GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-1V-8">1 vCPU + 8GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-1V-8-20">1 vCPU + 8GiB RAM + 20GB Disk</SelectItem>
                                                                </SelectGroup>
                                                                <SelectGroup>
                                                                    <SelectLabel>2 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-2V-4">2 vCPU + 4GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-2V-4-10">2 vCPU + 4GiB RAM + 10GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-2V-4-20s">2 vCPU + 4GiB RAM + 20GB SSD</SelectItem>
                                                                    <SelectItem value="SCS-2V-8">2 vCPU + 8GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-2V-8-20">2 vCPU + 8GiB RAM + 20GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-2V-16">2 vCPU + 16GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-2V-16-50">2 vCPU + 16GiB RAM + 50GB Disk</SelectItem>

                                                                </SelectGroup>
                                                                <SelectGroup>
                                                                    <SelectLabel>4 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-4V-8">4 vCPU + 8GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-4V-8-20">4 vCPU + 8GiB RAM + 20GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-4V-16">4 vCPU + 16GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-4V-16-50">4 vCPU + 16GiB RAM + 50GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-4V-16-100s">4 vCPU + 16GiB RAM + 100GB SSD</SelectItem>
                                                                    <SelectItem value="SCS-4V-32">4 vCPU + 32GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-4V-32-100">4 vCPU + 32GiB RAM + 100GB Disk</SelectItem>
                                                                </SelectGroup>
                                                                <SelectGroup>
                                                                    <SelectLabel>8 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-8V-32">8 vCPU + 32GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-8V-32-100">8 vCPU + 32GiB RAM + 100GB Disk</SelectItem>
                                                                    <SelectItem value="SCS-8V-16">8 vCPU + 16GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-8V-16-50">8 vCPU + 16GiB RAM + 50GB Disk</SelectItem>
                                                                </SelectGroup>
                                                                <SelectGroup>
                                                                    <SelectLabel>16 vCPU</SelectLabel>
                                                                    <SelectItem value="SCS-16V-32">16 vCPU + 32GiB RAM</SelectItem>
                                                                    <SelectItem value="SCS-16V-32-100">16 vCPU + 32GiB RAM + 100GB Disk</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>
                                                            Instance flavor of your worker nodes
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="basis-1/4">
                                            <FormField
                                                control={form.control}
                                                name="worker_replicas"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Replicas</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min={1} max={20} {...field} />
                                                        </FormControl>
                                                        <FormDescription>

                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                        <div>
                            <Card className="">
                                <CardHeader>
                                    <CardTitle>Variables</CardTitle>
                                    <CardDescription>
                                        {/* <Link className={buttonVariants({ variant: "link" })} href="https://github.com/SovereignCloudStack/provider/openstack/alpha/1-30/">Source</Link> */}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-4 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="pod_cidr"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pod CIDRs</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="192.168.0.0/16" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    CIDR addresses for all pods in the cluster
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="service_cidr"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Service CIDRs</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="10.96.0.0/12" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    CIDR addresses for all services in the cluster
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </CardContent>
                            </Card>
                        </div>
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
            </div >
        </>
    );
}
