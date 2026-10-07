# Helm Chart

> Full implementation: [../../session21-python/helm/](../../session21-python/helm/)

## Chart Contents
- `Chart.yaml` — Chart metadata
- `values.yaml` — Default values (image, replicas, resources)
- `templates/deployment.yaml`
- `templates/service.yaml`
- `templates/ingress.yaml`
- `templates/hpa.yaml`
- `templates/configmap.yaml`
- `templates/secret.yaml`

## Commands
```bash
helm install taskboard ./helm/taskboard-chart
helm upgrade taskboard ./helm/taskboard-chart
helm rollback taskboard 1
```
