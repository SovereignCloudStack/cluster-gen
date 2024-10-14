import { UiSchema } from "@rjsf/utils";

const uiSchema: UiSchema = {
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
      variables: {
        external_id: { "ui:widget": "hidden" },
        controller_root_disk: {
          "ui:title": "Controller Disk Size",
          "ui:description": "Root disk size in GiB for control-plane nodes",
        },
        worker_root_disk: {
          "ui:title": "Worker Disk Size",
          "ui:description": "Root disk size in GiB for worker nodes",
        },
        ssh_key: {
          "ui:title": "SSH Key",
          "ui:description": "The SSH key to inject in the nodes",
        },
        node_cidr: {
          "ui:title": "Node CIDR",
          "ui:description": "NodeCIDR is the OpenStack Subnet to be created",
        },
        dns_nameservers: {
          "ui:title": "DNS Nameservers",
          "ui:description":
            "The list of nameservers for the OpenStack Subnet being created. Set this value when you need to create a new network/subnet while the access through DNS is required.",
        },
        apiserver_loadbalancer: {
          "ui:title": "API Server Loadbalancer",
          "ui:description":
            "Configure the loadbalancer that is placed in front of the apiserver",
        },
        workload_loadbalancer: {
          "ui:title": "Workload Loadbalancer",
          "ui:description":
            "Configure the loadbalancer solution for your services inside your cluster.",
        },
        oidc_config: {
          username_claim: {
            "ui:description": "JWT claim to use as the user name.",
          },
          username_prefix: {
            "ui:description":
              "Prefix to username claims to prevent clashes with existing names (such as system: users).",
          },
          groups_prefix: {
            "ui:description":
              "Prefix to group claims to prevent clashes with existing names (such as system: groups).",
          },
          issuer_url: {
            "ui:description":
              "URL of the provider that allows the API server to dis cover public signing keys.",
          },
        },
        controlPlaneAvailabilityZones: {
          "ui:title": "Controlplane Availability Zones",
          "ui:description":
            "ControlPlaneAvailabilityZones is the set of availability zones which control plane machines may be deployed to.",
        },
        controlPlaneOmitAvailabilityZone: {
          "ui:title": "Controlplane Omit Availability Zones",
          "ui:description":
            "ControlPlaneOmitAvailabilityZone causes availability zone to be omitted when creating control plane nodes, allowing the Nova scheduler to make a decision on which availability zone to use based on other scheduling constraints.",
          "ui:widget": "select",
        },
      },
    },
  },
};

export default uiSchema;
