# Session 10 - Kubernetes Core Objects: Deployments, Strategies & Pod Lifecycle

**Name:** Durga Prasad  
**Enrollment Number:** 10012

---

## Overview

This session covers advanced Kubernetes deployment strategies and pod lifecycle management. The core topics are:
- **Rolling Update** — Zero-downtime incremental pod replacement
- **Blue-Green Deployment** — Instant traffic switching between two identical environments
- **Canary Deployment** — Gradual traffic shifting to new versions
- **Recreate Strategy** — Full replacement with a maintenance window
- **DaemonSets** — Running one pod per node
- **Pod Lifecycle** — Understanding pod states, probes, and init containers

---

## Task 1: Rolling Update Strategy

Rolling Update is Kubernetes' **default** deployment strategy. It incrementally replaces old pods with new ones — keeping the service live throughout the entire rollout.

### Key Parameters:
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1        # Extra pods allowed above desired count
    maxUnavailable: 0  # Pods that can be missing during update
```

### YAML: `01-rolling-update/deployment-v1.yaml` → `deployment-v2.yaml`

### Commands & Output:
```bash
kubectl apply -f 01-rolling-update/deployment-v1.yaml
kubectl rollout status deployment/app-rolling
```
```
deployment.apps/app-rolling successfully rolled out
```

```bash
# Update to v2
kubectl apply -f 01-rolling-update/deployment-v2.yaml
kubectl rollout status deployment/app-rolling
```
```
Waiting for deployment "app-rolling" rollout to finish: 1 out of 4 new replicas have been updated...
deployment.apps/app-rolling successfully rolled out
```

```bash
# Rollback if needed
kubectl rollout undo deployment/app-rolling
kubectl rollout history deployment/app-rolling
```

---

## Task 2: Blue-Green Deployment Strategy

Blue-Green maintains **two identical environments** (blue = old, green = new). Traffic switches instantly by updating the Service selector — zero downtime and instant rollback.

### Architecture:
```
                 ┌─────────────────────┐
Users ──► Service (selector: env=blue) ─► Blue Pods (v1) [LIVE]
                 └─────────────────────┘
                 ┌─────────────────────┐
                 Service (selector: env=green) ─► Green Pods (v2) [STANDBY]
                 └─────────────────────┘
```

### YAML Files: `02-blue-green/`

### Commands & Output:
```bash
kubectl apply -f 02-blue-green/
kubectl get deployments
```
```
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
app-blue         3/3     3            3           1m
app-green        3/3     3            3           1m
```

```bash
# Switch traffic from blue to green
kubectl patch service blue-green-svc -p '{"spec":{"selector":{"env":"green"}}}'
kubectl get service blue-green-svc
```
```
NAME             TYPE        CLUSTER-IP     SELECTOR
blue-green-svc   ClusterIP   10.96.45.12    env=green
```

---

## Task 3: Canary Deployment Strategy

Canary deployment sends a **small percentage of traffic** to the new version while keeping most traffic on the stable version. Gradually increase canary replicas as confidence grows.

### Architecture (10% → 100% rollout):
```
Service ──► Stable (9 replicas, v1) ← 90% traffic
        └─► Canary  (1 replica,  v2) ← 10% traffic
```

### YAML Files: `03-canary/`

### Commands & Output:
```bash
kubectl apply -f 03-canary/
kubectl get pods -l app=web-app
```
```
NAME                       READY   STATUS    LABELS
web-stable-xxx-aaa         1/1     Running   track=stable
web-stable-xxx-bbb         1/1     Running   track=stable
web-stable-xxx-ccc         1/1     Running   track=stable
web-canary-yyy-aaa         1/1     Running   track=canary
```

```bash
# Scale up canary after validation
kubectl scale deployment web-canary --replicas=4
kubectl scale deployment web-stable --replicas=6
```

---

## Task 4: Recreate Strategy

Recreate terminates **all old pods first**, then starts all new pods. This causes downtime but is simple and ensures no two versions run simultaneously (useful for apps that can't run side-by-side).

### YAML Files: `04-recreate/`

### Commands & Output:
```bash
kubectl apply -f 04-recreate/deployment-v1.yaml
kubectl apply -f 04-recreate/deployment-v2.yaml
kubectl rollout status deployment/app-recreate
```
```
Waiting for deployment "app-recreate" rollout to finish: 0 out of 4 new replicas have been updated...
# Brief downtime window here — all v1 pods killed, v2 pods starting
deployment.apps/app-recreate successfully rolled out
```

---

## Task 5: DaemonSet

A **DaemonSet** ensures one pod runs on **every node** in the cluster. Used for node monitoring agents, log collectors, or security scanners.

### YAML: `daemonset/node-agent-ds.yaml`

### Commands & Output:
```bash
kubectl apply -f daemonset/node-agent-ds.yaml
kubectl get daemonset node-agent
```
```
NAME         DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
node-agent   3         3         3       3            3           <none>          1m
```

```bash
# DaemonSet creates one pod per node
kubectl get pods -l app=node-agent -o wide
```
```
NAME               READY   STATUS    NODE
node-agent-abcde   1/1     Running   node1
node-agent-fghij   1/1     Running   node2
node-agent-klmno   1/1     Running   node3
```

---

## Task 6: Pod Lifecycle States

Kubernetes pods go through well-defined lifecycle states from creation to termination.

### Pod States Summary:

| State | Description | Common Cause |
|---|---|---|
| **Pending** | Pod scheduled but not running | Image pull, insufficient resources |
| **Running** | At least one container running | Normal operation |
| **Succeeded** | All containers exited with code 0 | Completed Jobs |
| **Failed** | All containers exited, at least one with non-zero | App crash |
| **CrashLoopBackOff** | Container keeps crashing and restarting | App error, misconfiguration |
| **ImagePullBackOff** | Cannot pull container image | Wrong image name, no registry access |

### Pod Lifecycle YAMLs: `pod-lifecycle/`

```bash
# Test various pod states
kubectl apply -f pod-lifecycle/01-running.yaml
kubectl apply -f pod-lifecycle/05-crashloopbackoff.yaml
kubectl get pods
```
```
NAME                  STATUS             RESTARTS
pod-running           Running            0
pod-crashloop         CrashLoopBackOff   5
pod-imagepullback     ImagePullBackOff   0
```

---

## Deployment Strategies Comparison

| Strategy | Downtime | Rollback | Cost | Use Case |
|---|---|---|---|---|
| **Rolling Update** | Zero | `kubectl rollout undo` | 1x | Standard production updates |
| **Blue-Green** | Zero | Flip selector back | 2x | Instant cutover, stateful apps |
| **Canary** | Zero | Remove canary pods | 1.1x-2x | Gradual validation, A/B testing |
| **Recreate** | Yes | Redeploy old version | 1x | Dev/test, incompatible versions |

---

## Troubleshooting

```bash
# View rollout history
kubectl rollout history deployment/<name>

# Rollback to previous version
kubectl rollout undo deployment/<name>

# Rollback to a specific revision
kubectl rollout undo deployment/<name> --to-revision=2

# Check pod events for CrashLoopBackOff
kubectl describe pod <pod-name>

# View pod logs for crashes
kubectl logs <pod-name> --previous
```
