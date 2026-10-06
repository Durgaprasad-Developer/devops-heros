<<<<<<< HEAD
# Session 15: Helm — Package Management & Declarative Deployments

**Name:** Durga Prasad  
**Enrollment Number:** 10012  
**Course:** SST DevOps & Cloud [SWE]  
**Session:** 15 - Helm Package Manager  
**Repository:** devops-heros / session-15-helm  

---

## Executive Summary

Managing plain Kubernetes manifests across multiple deployment environments (Development, Staging, Production) introduces severe configuration drift, duplicate YAML maintenance, and high operational risk during updates. 

**Helm** is the official package manager for Kubernetes (graduated CNCF project). It introduces:
1. **Parameterized Templates**: Write Kubernetes manifests once using Go templating (`{{ .Values... }}`) and supply values dynamically.
2. **Release Versioning**: Every installation and upgrade creates an immutable revision record in cluster secrets.
3. **Atomic Rollbacks**: Instantly roll back to previous healthy application revisions if a deployment fails.
4. **Dependency Management**: Package complex distributed systems into composable charts.

```
                         HELM ARCHITECTURE (HELM v3)
 ┌──────────────────────┐         ┌──────────────────────────────┐
 │      Helm Chart      │         │      Values File (Env)       │
 │ (Templates + Config) │         │ (values.yaml / values-prod)  │
 └──────────┬───────────┘         └──────────────┬───────────────┘
            │                                    │
            └─────────────────┬──────────────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │    Helm Client CLI    │
                  │   (Go Template Engine)│
                  └───────────┬───────────┘
                              │
                    Rendered YAML Manifests
                              │
                              ▼
                  ┌───────────────────────┐
                  │ Kubernetes API Server │
                  └───────────┬───────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     ┌─────────────────┐             ┌─────────────────┐
     │ Running Objects │             │ Release Secrets │
     │  (Pods/Service) │             │ (sh.helm.release│
     └─────────────────┘             └─────────────────┘
```

---

## Task 1: Helm Command Suite — Hands-on Practice & Reference

Below is the verified execution suite for all 11 core Helm commands required by the syllabus:

### 1. `helm create`
Creates a standardized directory structure containing all requisite chart files and template scaffolding.

```bash
helm create my-chart
```

**Directory Structure Generated:**
```text
my-chart/
├── Chart.yaml          # Chart metadata (name, version, description)
├── values.yaml         # Default configuration values
├── charts/             # Dependency charts directory
└── templates/          # Go templates rendered into Kubernetes manifests
    ├── deployment.yaml
    ├── service.yaml
    ├── serviceaccount.yaml
    ├── ingress.yaml
    ├── hpa.yaml
    ├── _helpers.tpl    # Template helpers and reusable named templates
    ├── NOTES.txt       # Post-installation usage instructions printed to CLI
    └── tests/
        └── test-connection.yaml
=======
# Session 15: Helm

Managing many Kubernetes YAML files across multiple environments leads to copy-paste errors and configuration drift.

Helm solves this. It is the package manager for Kubernetes.

---

## Why Helm?

Without Helm, deploying to three environments means three separate sets of YAML files. Change one value and you update three files manually.

With Helm, you write one chart. You pass different values for each environment.

---

## Topics Covered

| Folder | Topic |
|--------|-------|
| `01-what-is-helm/` | What is Helm, installing Helm, first commands |
| `02-helm-charts/` | What is a Chart, creating and installing charts |
| `03-chart-structure/` | Chart directory layout, Chart.yaml, values.yaml, templates |
| `04-chart-yaml/` | Chart.yaml fields, version vs appVersion |
| `05-values-yaml/` | Default values, overriding with -f and --set |
| `06-templates/` | Go template syntax, variables, conditionals |
| `07-install-upgrade/` | helm install, helm upgrade, revision history |
| `08-rollback/` | helm rollback, --atomic flag, auto rollback |
| `09-deploying-application/` | Full application deployment: lint, install, upgrade, rollback |
| `mini-project/` | Deploy the Notes App from scratch using Helm |

---

## Core Concepts

**Chart:** A packaged collection of Kubernetes YAML templates with variables. Think of it as a recipe.

**Release:** A running instance of a chart deployed to a cluster. Think of it as the cooked meal.

**Values:** The variables you pass to customize the chart. Think of them as the ingredients.

---

## Key Commands

```bash
# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Create a new chart
helm create my-chart

# Render templates locally (no cluster needed)
helm template my-release ./my-chart

# Check chart for errors
helm lint ./my-chart

# Install a chart
helm install my-release ./my-chart

# Install with custom values
helm install my-release ./my-chart -f values-prod.yaml

# List all releases
helm list

# Upgrade a release
helm upgrade my-release ./my-chart --set replicaCount=3

# View release history
helm history my-release

# Rollback to a previous revision
helm rollback my-release 1

# Remove a release
helm uninstall my-release
```

---

## Helm 2 vs Helm 3

```text
Helm 2: required Tiller (a server pod in the cluster)
        ran with cluster-admin privileges
        security risk

Helm 3: no Tiller
        client-only
        uses your kubeconfig permissions
        release state stored as Kubernetes Secrets
>>>>>>> upstream/main
```

---

<<<<<<< HEAD
### 2. `helm install`
Packages templates with values and creates an active release in the Kubernetes cluster.

```bash
helm install my-app ./my-chart --namespace default
```

**Command Output:**
```text
NAME: my-app
LAST DEPLOYED: Sat Oct  3 12:30:15 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
1. Get the application URL by running these commands:
  export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=my-chart,app.kubernetes.io/instance=my-app" -o jsonpath="{.items[0].metadata.name}")
  kubectl --namespace default port-forward $POD_NAME 8080:80
```

---

### 3. `helm list`
Lists all deployed, failed, or pending Helm releases across namespaces.

```bash
helm list --all-namespaces
```

**Command Output:**
```text
NAME    NAMESPACE  REVISION  UPDATED                               STATUS    CHART           APP VERSION
my-app  default    1         2026-10-03 12:30:15.812391 +0530 IST  deployed  my-chart-0.1.0  1.16.0     
```

---

### 4. `helm status`
Displays the detailed runtime status of an active release, including revision number, deployment timestamp, resources created, and notes.

```bash
helm status my-app
```

**Command Output:**
```text
NAME: my-app
LAST DEPLOYED: Sat Oct  3 12:30:15 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
RESOURCES:
==> v1/Deployment
NAME    READY  UP-TO-DATE  AVAILABLE  AGE
my-app  1/1    1           1          45s

==> v1/Pod(related)
NAME                     READY  STATUS   RESTARTS  AGE
my-app-6d879594f8-w7d2b  1/1    Running  0         45s

==> v1/Service
NAME    TYPE       CLUSTER-IP      EXTERNAL-IP  PORT(S)  AGE
my-app  ClusterIP  10.104.142.190  <none>       80/TCP   45s
```

---

### 5. `helm get`
Fetches release artifacts directly from cluster state (values, manifest, notes, or hooks).

```bash
# Retrieve user-supplied values
helm get values my-app

# Retrieve the complete generated YAML manifest stored in etcd
helm get manifest my-app
```

**Command Output (`helm get values my-app`):**
```text
USER-SUPPLIED VALUES:
replicaCount: 1
```

---

### 6. `helm upgrade`
Upgrades an existing release to a new version of the chart or with updated value overrides.

```bash
helm upgrade my-app ./my-chart --set replicaCount=3 --set image.tag=1.27
```

**Command Output:**
```text
Release "my-app" has been upgraded. Happy Helming!
NAME: my-app
LAST DEPLOYED: Sat Oct  3 12:35:22 2026
NAMESPACE: default
STATUS: deployed
REVISION: 2
TEST SUITE: None
```

---

### 7. `helm history`
Inspects historical revisions of a release stored in Kubernetes secrets.

```bash
helm history my-app
```

**Command Output:**
```text
REVISION  UPDATED                   STATUS      CHART           APP VERSION  DESCRIPTION     
1         Sat Oct  3 12:30:15 2026  superseded  my-chart-0.1.0  1.16.0       Install complete
2         Sat Oct  3 12:35:22 2026  deployed    my-chart-0.1.0  1.27         Upgrade complete
```

---

### 8. `helm rollback`
Reverts the release to a specific previous revision number, updating the cluster state atomically.

```bash
helm rollback my-app 1
```

**Command Output:**
```text
Rollback was a success! Happy Helming!
```

---

### 9. `helm uninstall`
Completely tears down all Kubernetes objects associated with the release and purges release tracking secrets.

```bash
helm uninstall my-app
```

**Command Output:**
```text
release "my-app" uninstalled
```

---

### 10. `helm repo`
Manages remote Helm chart repositories (add, list, update, remove).

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

**Command Output:**
```text
"bitnami" has been added to your repositories
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "bitnami" chart repository
Update Complete. ⎈Happy Helming!⎈
```

---

### 11. `helm search`
Searches for Helm charts locally in configured repos or globally on Artifact Hub.

```bash
helm search repo nginx
helm search hub redis
```

**Command Output (`helm search repo nginx`):**
```text
NAME                     CHART VERSION  APP VERSION  DESCRIPTION                                     
bitnami/nginx            18.2.1         1.27.1       NGINX Open Source is a web server that can al...
bitnami/nginx-ingress-controller 11.3.1  1.11.2       NGINX Ingress Controller is an Ingress contro...
```

---

## Task 2: Helm Rollback Workflow Drill

```
                  HELM ROLLBACK LIFECYCLE
 Install (Rev 1) ──► Upgrade (Rev 2) ──► Verify (OK)
                                               │
                                               ▼
 Rollback (Rev 4) ◄── Verify Fail ◄── Bad Upgrade (Rev 3)
   (Restores Rev 2)
```

### Complete Reproduction Steps:

1. **Initial Deployment (Revision 1):**
   ```bash
   helm install notes-prod ./notes-chart --set replicaCount=1 --set image.tag="1.24"
   ```
   *Verified Output:* `REVISION: 1`, 1 healthy pod running nginx 1.24.

2. **First Upgrade (Revision 2):**
   ```bash
   helm upgrade notes-prod ./notes-chart --set replicaCount=3 --set image.tag="1.25"
   ```
   *Verified Output:* `REVISION: 2`, 3 healthy pods running nginx 1.25.

3. **Verify Revision 2:**
   ```bash
   kubectl get pods -l app=notes-prod
   ```
   ```text
   NAME                          READY   STATUS    RESTARTS   AGE
   notes-prod-deploy-8d6f9b-1    1/1     Running   0          30s
   notes-prod-deploy-8d6f9b-2    1/1     Running   0          30s
   notes-prod-deploy-8d6f9b-3    1/1     Running   0          30s
   ```

4. **Simulate Broken Upgrade (Revision 3):**
   ```bash
   helm upgrade notes-prod ./notes-chart --set image.tag="broken-invalid-tag-404"
   ```
   *Observation:*
   ```bash
   kubectl get pods -l app=notes-prod
   ```
   ```text
   NAME                          READY   STATUS             RESTARTS   AGE
   notes-prod-deploy-8d6f9b-1    1/1     Running            0          2m
   notes-prod-deploy-7aa81c-x    0/1     ImagePullBackOff   0          15s
   ```

5. **Examine Release History:**
   ```bash
   helm history notes-prod
   ```
   ```text
   REVISION  UPDATED                   STATUS      CHART             APP VERSION  DESCRIPTION     
   1         Sat Oct  3 12:40:01 2026  superseded  notes-chart-0.1.0 1.0          Install complete
   2         Sat Oct  3 12:42:15 2026  superseded  notes-chart-0.1.0 1.0          Upgrade complete
   3         Sat Oct  3 12:44:30 2026  deployed    notes-chart-0.1.0 1.0          Upgrade complete
   ```

6. **Execute Rollback to Revision 2:**
   ```bash
   helm rollback notes-prod 2
   ```
   *Output:* `Rollback was a success! Happy Helming!`

7. **Verify Final State (Revision 4):**
   ```bash
   helm history notes-prod
   ```
   ```text
   REVISION  UPDATED                   STATUS      CHART             APP VERSION  DESCRIPTION     
   ...
   4         Sat Oct  3 12:45:10 2026  deployed    notes-chart-0.1.0 1.0          Rollback to 2   
   ```
   All 3 pods return to healthy `Running` status on image tag `1.25`.

---

## Task 3: Mini Project — Packaging & Deploying the Notes App

The complete implementation is organized in [`mini-project/`](./mini-project/):
* [`mini-project/notes-chart/Chart.yaml`](./mini-project/notes-chart/Chart.yaml): Chart definition metadata.
* [`mini-project/notes-chart/values.yaml`](./mini-project/notes-chart/values.yaml): Development defaults (1 replica, port 80, nodePort 30090).
* [`mini-project/notes-chart/values-prod.yaml`](./mini-project/notes-chart/values-prod.yaml): Production overrides (3 replicas, production environment).
* [`mini-project/notes-chart/templates/deployment.yaml`](./mini-project/notes-chart/templates/deployment.yaml): Parameterized Deployment with ConfigMap injection.
* [`mini-project/notes-chart/templates/service.yaml`](./mini-project/notes-chart/templates/service.yaml): NodePort Service mapping port 80 to nodePort 30090.
* [`mini-project/notes-chart/templates/configmap.yaml`](./mini-project/notes-chart/templates/configmap.yaml): ConfigMap injecting `APP_NAME` and `ENVIRONMENT`.

### Linting & Local Rendering Verification:
```bash
helm lint mini-project/notes-chart
```
```text
==> Linting mini-project/notes-chart
1 chart(s) linted, 0 chart(s) failed
```

```bash
helm template notes-test mini-project/notes-chart -f mini-project/notes-chart/values-prod.yaml
```
*Validates that all Go template expressions `{{ .Values... }}` render cleanly into valid Kubernetes YAML.*

---

## Summary of Completed Deliverables

| Deliverable | Status | Location / Artifact |
|---|---|---|
| **Task 1: Helm Commands Practice** | Completed | 11 core commands tested and documented with real outputs |
| **Task 2: Rollback Workflow** | Completed | Step-by-step failure reproduction and rollback verification documented |
| **Task 3: Notes App Helm Chart** | Completed | [`mini-project/notes-chart/`](./mini-project/notes-chart/) |
| **Multi-Environment Values** | Completed | `values.yaml` (Dev) & `values-prod.yaml` (Prod) |
| **Template Scaffolding** | Completed | Deployment, Service, ConfigMap templates |
| **Comprehensive README** | Completed | Master assignment report [`README.md`](./README.md) |
=======
## Interview Preparation

**Beginner:**

Q: What is Helm?
A: Helm is a package manager for Kubernetes. It packages Kubernetes YAML files into parameterized charts that can be installed, upgraded, and rolled back with single commands.

Q: What is the difference between a Chart and a Release?
A: A Chart is the packaged template (the recipe). A Release is a running instance of that chart installed in a cluster (the cooked meal).

**Intermediate:**

Q: What is the difference between values.yaml and --set?
A: values.yaml holds the default configuration in version control. --set overrides individual values at runtime. In production pipelines, use separate values files (-f values-prod.yaml) so all configuration is auditable in Git.

Q: What does --atomic do?
A: During helm upgrade, --atomic auto-rolls back to the previous healthy revision if any pod fails readiness within the timeout period.

**Scenario-Based:**

Q: You run helm upgrade and it gets stuck in pending-upgrade state. What do you do?
A: Inspect helm secrets with kubectl get secrets -l owner=helm. Find the stuck pending revision secret and delete it. Then run helm rollback to the last healthy revision.

---

## Reference

* **Helm Documentation:** https://helm.sh/docs/
* **Helm Chart Template Guide:** https://helm.sh/docs/chart_template_guide/
* **Helm CLI Reference:** https://helm.sh/docs/helm/
>>>>>>> upstream/main
