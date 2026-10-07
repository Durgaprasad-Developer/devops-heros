# Kubernetes Manifests

> Full implementation: [../../session21-python/k8s/](../../session21-python/k8s/)

## Resources
- `deployment.yaml` — Rolling update strategy
- `service.yaml` — ClusterIP + NodePort
- `configmap.yaml` — App configuration (DB host, log level)
- `secret.yaml` — DB credentials (base64 encoded)
- `ingress.yaml` — Nginx Ingress routing
- `hpa.yaml` — CPU-based autoscaling (min:2, max:10, target:50%)
- `pvc.yaml` — PostgreSQL persistent storage
