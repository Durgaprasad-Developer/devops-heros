# Monitoring & Observability

> Full implementation: [../../session20-monitoring-observability-gitops/](../../session20-monitoring-observability-gitops/)

## Stack
- **Prometheus** — Metrics collection (CPU, Memory, HTTP rate, latency)
- **Grafana** — Dashboards and alerting
- **Loki** — Log aggregation
- **Alertmanager** — Alert routing (Slack/email)

## Setup
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack
```
