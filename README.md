# Cluster Gen

[MVP](https://github.com/SovereignCloudStack/cluster-stacks/issues/114) Web UI for creating Cluster objects based on SCS Cluster Stacks.

## Workflow

- Read cluster stack and clusterclass templates
- Render/populate yaml in live editor with good defaults
- On "Generate": perform form validation, create yaml file and open up download prompt (all client-side)

## Limitations (to be implemented)

- ClusterClass and Cluster Stack templates are [hard-coded](src/components/cluster-form.tsx#L90) and limited to the `scs/alpha` Cluster Stacks
  - Ideally they should reflect the current state of each specific Cluster Stack (e.g. metal3/kamaji)
  - Possible solution: Use GitHub API to read and then parse the ClusterClasses. Maybe build upon on [this](https://github.com/SovereignCloudStack/cluster-stacks/pull/94)
- Cluster Stack releases are [hard-coded](src/components/clusterstack-form.tsx#L116)
  - Possible solution: Use GitHub API to get releases
- Instance flavors are [hard-coded](src/components/cluster-form.tsx#L347)
  - Possible solution: Use gx-scs API to get available instance flavors

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
