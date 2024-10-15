# Cluster Gen

Web UI for creating Cluster objects based on SCS Cluster Stacks.

## Workflow

- Read ClusterClass schema definitions from the kube-apiserver of the moin-cluster via the API provided by [capi-jsgen](https://github.com/SovereignCloudStack/capi-jsgen)
- Render yaml form with live editor
- On Download: perform form validation, create yaml file and open up download prompt

## Built with

- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form)
- [capi-jsgen](https://github.com/SovereignCloudStack/capi-jsgen)

## Setup

### Requirements

- A running cluster in which you apply your ClusterClass definitions
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

### Release

A new [release](https://github.com/SovereignCloudStack/cluster-gen/releases) and build is [triggered](https://github.com/SovereignCloudStack/cluster-gen/blob/main/.github/workflows/release.yml) by a version tag push on main

```bash
git tag v0.0.x
git push origin v0.0.x
```
