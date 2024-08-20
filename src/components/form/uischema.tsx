import { UiSchema } from "@rjsf/utils";

export const uiSchema: UiSchema = {
  kind: { "ui:widget": "hidden" },
  apiVersion: { "ui:widget": "hidden" },
  metadata: {
    name: {
      "ui:title": "Cluster name",
      "ui:description": "Name of your Cluster",
    },
    namespace: {
      "ui:description": "Namespace in which to deploy the Cluster",
    },
    labels: { "ui:widget": "hidden" },
  },
  spec: {
    clusterNetwork: {
      serviceDomain: { "ui:widget": "hidden" },
      services: {
        cidrBlocks: {
          items: {
            "ui:title": "Service CIDRs",
            "ui:description": "CIDR addresses for all services in the cluster",
          },
        },
      },
      pods: {
        cidrBlocks: {
          items: {
            "ui:title": "Pod CIDRs",
            "ui:description": "CIDR addresses for all pods in the cluster",
          },
        },
      },
    },
    topology: {
      class: { "ui:widget": "hidden" },
      version: {
        "ui:title": "Kubernetes version",
        "ui:description": "Select which Kubernetes minor version you want",
        "ui:field": "k8s_version",
      },
      controlPlane: {
        replicas: {
          "ui:title": "Control plane replicas",
          "ui:description": "How many control plane replicas you want",
          "ui:widget": "updown",
        },
      },
      workers: {
        machineDeployments: {
          items: {
            name: { "ui:widget": "hidden" },
            failureDomain: { "ui:widget": "hidden" },
            class: { "ui:widget": "hidden" },
            replicas: {
              "ui:title": "Worker replicas",
              "ui:description": "How many worker replicas you want",
              "ui:widget": "updown",
            },
          },
        },
      },
      //variables: { items: { "ui:widget": "hidden" } },
    },
  },
};
