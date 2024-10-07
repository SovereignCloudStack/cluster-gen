# Getting started

You can try out our [hosted version](https://cluster-gen.moin.k8s.scs.community) on SCS infrastructure.
Alternatively you can simply follow the setup instructions outlined below to deploy your own version of the UI.

## Setup

### Requirements

- A running cluster in which you apply your ClusterClasses definitions
- An instance of [capi-jsgen](https://github.com/SovereignCloudStack/capi-jsgen) that points to the kube-apiserver of the cluster

### Prerequisites

- [pnpm](https://pnpm.io/installation)

### Develop locally

```bash
pnpm i
pnpm dev
```

### Build for production

```bash
pnpm build
pnpm start
```

#### Docker

```bash
docker build -t cluster-gen .
docker run -p 3000:3000 cluster-gen
```

#### Helm

Inside `charts/` you can find a minimal chart to deploy Cluster Gen on Kubernetes with a Service and an Ingress.
