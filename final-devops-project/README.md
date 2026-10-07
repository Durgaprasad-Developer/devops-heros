# 🚀 Final DevOps Project — End-to-End Pipeline

**Author:** Durga Prasad  
**Enrollment Number:** 10012  
**Course:** SST DevOps & Cloud [SWE]  
**Session:** 21 — Final Project Submission  

> ⚠️ **This is the final project submission placeholder.**  
> The fully implemented capstone project lives in [`../session21-python/`](../session21-python/).  
> This folder provides the required folder structure as specified in the assignment.

---

## 📐 Project Architecture

```
Developer Laptop
     │
     ▼
Git / GitHub (Source Control)
     │
     ▼
GitHub Actions (CI/CD)
     ├── Build & Test (pytest, npm test)
     ├── SAST (CodeQL)
     ├── SCA (pip-audit / npm audit)
     ├── Secret Scanning (gitleaks)
     ├── Docker Build & Tag
     ├── Trivy Image Scan
     ├── Security Gate (block on CRITICAL CVEs)
     └── Push → GitHub Container Registry (GHCR)
                │
                ▼
         Terraform (IaC)
                │
         AWS Infrastructure
         ├── VPC + Subnets
         ├── Security Groups
         ├── EKS Cluster
         └── S3 (state backend)
                │
                ▼
          Kubernetes (EKS)
          ├── Deployment (Rolling Update)
          ├── Service (ClusterIP + Ingress)
          ├── ConfigMap (app config)
          ├── Secret (db passwords)
          ├── Ingress (Nginx)
          ├── HPA (CPU-based autoscaling)
          └── PVC (PostgreSQL storage)
                │
                ▼
           Helm Chart
           └── notes-chart (install/upgrade/rollback)
                │
                ▼
       Monitoring & GitOps
       ├── Prometheus (metrics)
       ├── Grafana (dashboards)
       └── ArgoCD (GitOps continuous reconciliation)
```

---

## 📁 Folder Structure

```
final-devops-project/
├── application/          ← FastAPI backend + React frontend source code
├── docker/               ← Dockerfiles for backend & frontend
├── kubernetes/           ← K8s manifests (Deployment, Service, ConfigMap, Secret, Ingress, HPA)
├── helm/                 ← Helm chart for application deployment
├── terraform/            ← IaC for AWS VPC + EKS + S3 state
├── .github/
│   └── workflows/        ← GitHub Actions CI & CD workflows
├── security/             ← Security tool configs (CodeQL, gitleaks, pip-audit)
├── monitoring/           ← Prometheus rules + Grafana dashboard JSON
├── gitops/               ← ArgoCD Application manifest
├── docs/
│   └── screenshots/      ← Evidence screenshots for submission
└── README.md             ← This file
```

---

## 🔗 Full Implementation

The complete, working implementation of this project is in:

👉 **[../session21-python/](../session21-python/)**

That folder contains:
- `frontend/` — React + Vite TaskBoard UI
- `backend/` — FastAPI + SQLAlchemy + Alembic Python API
- `k8s/` — Kubernetes manifests
- `helm/` — Helm chart
- `terraform/` — AWS infrastructure
- `.github/workflows/` — Full CI/CD pipeline
- `monitoring/` — Prometheus & Grafana
- `troubleshooting/` — Kubernetes debugging exercises

---

## 🛠️ Technologies Used

| Category | Technology |
|---|---|
| **Application** | Python (FastAPI), React + Vite, PostgreSQL |
| **Containers** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (EKS), Helm v3 |
| **CI/CD** | GitHub Actions |
| **Security** | CodeQL (SAST), pip-audit (SCA), gitleaks (secret scan), Trivy (container scan) |
| **Infrastructure** | Terraform, AWS (VPC, EKS, S3, IAM) |
| **Monitoring** | Prometheus, Grafana |
| **GitOps** | ArgoCD |

---

## 📸 Evidence & Screenshots

> Screenshots are in [`docs/screenshots/`](./docs/screenshots/).  
> Command outputs and pipeline evidence are in the [session21-python README](../session21-python/README.md).

---

## ✅ Submission Checklist

- [x] Application source code (FastAPI + React)
- [x] Dockerfile (multi-stage build)
- [x] GitHub Actions CI workflow
- [x] GitHub Actions CD workflow
- [x] Kubernetes manifests (Deployment, Service, ConfigMap, Secret, Ingress, HPA)
- [x] Helm chart with values.yaml
- [x] Terraform infrastructure (VPC + EKS + S3)
- [x] SAST (CodeQL)
- [x] SCA (pip-audit)
- [x] Secret scanning (gitleaks)
- [x] Container image scanning (Trivy)
- [x] Security gate (block pipeline on CRITICAL)
- [x] Prometheus monitoring
- [x] Grafana dashboard
- [x] ArgoCD GitOps workflow
- [x] Troubleshooting documentation
- [x] Screenshots & command outputs
- [x] Complete README.md
