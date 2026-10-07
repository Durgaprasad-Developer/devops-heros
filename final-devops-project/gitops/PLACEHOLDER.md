# GitOps (ArgoCD)

> Full implementation: [../../session20-monitoring-observability-gitops/07-argocd/](../../session20-monitoring-observability-gitops/07-argocd/)

## ArgoCD Application
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: taskboard
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/Durgaprasad-Developer/devops-heros
    targetRevision: main
    path: session21-python/k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: taskboard
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```
