# GitHub Actions Workflows

> Full implementation: [../../session21-python/.github/](../../session21-python/) and [../../session-16-github-actions/10-final-cicd-pipeline/](../../session-16-github-actions/10-final-cicd-pipeline/)

## Workflows
- `ci.yml` — Lint, test, SAST, SCA, secret scan
- `cd.yml` — Docker build, Trivy scan, push GHCR, K8s deploy
