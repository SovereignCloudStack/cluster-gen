# Cluster Gen

Proof of concept Web UI for creating Cluster objects based on SCS Cluster Stacks.

## Workflow

- Read clusterclass definitions from the public kube-apiserver API of the moin-cluster
- Render/populate yaml in live editor with good defaults
- On Download: perform form validation, create yaml file and open up download prompt

## Built with

- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Setup

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
