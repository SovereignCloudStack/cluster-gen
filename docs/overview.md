# Overview

[Cluster Gen](https://cluster-gen.moin.k8s.scs.community) is a simple Web UI for generating Cluster objects based on Cluster Stacks

## Workflow

- Read clusterclass schema definitions from the kube-apiserver of the moin-cluster via the API provided by [capi-jsgen](https://github.com/SovereignCloudStack/capi-jsgen)
- Render yaml form in live editor with sane defaults
- On Download: perform form validation, create yaml file and open up download prompt

## Built with

- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form)
- [capi-jsgen](https://github.com/SovereignCloudStack/capi-jsgen)
