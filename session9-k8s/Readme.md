# Session 9 - Kubernetes Fundamentals

## Overview
This session covers the basics of Kubernetes (K8s), including setup, core concepts, and hands-on YAML manifests.

## Resources
- https://kubernetes.io/docs/tutorials/kubernetes-basics/
- https://minikube.sigs.k8s.io/docs/start/
- https://kubernetes.io/docs/concepts/architecture/
- https://github.com/Nency-Ravaliya/Kubernetes

---

## Setup: Minikube Installation

Minikube is used to run a local Kubernetes cluster.

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# Install minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start cluster
minikube start

# Verify
kubectl get nodes
```

---

## Task 1: Pod

A **Pod** is the smallest deployable unit in Kubernetes.

```yaml
# pod/nginx-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
    environment: dev
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
```

### Commands:
```bash
kubectl apply -f pod/nginx-pod.yaml
kubectl get pods
kubectl describe pod nginx-pod
kubectl logs nginx-pod
```

---

## Task 2: ReplicaSet

A **ReplicaSet** ensures a specified number of pod replicas are always running.

```yaml
# replicaset/nginx-replicaset.yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-replicaset
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
```

### Commands:
```bash
kubectl apply -f replicaset/nginx-replicaset.yaml
kubectl get replicaset
kubectl get pods
```

---

## Task 3: Deployment

A **Deployment** provides declarative updates for Pods and ReplicaSets.

```yaml
# deployment/nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
```

### Commands:
```bash
kubectl apply -f deployment/nginx-deployment.yaml
kubectl get deployments
kubectl rollout status deployment/nginx-deployment
kubectl rollout history deployment/nginx-deployment
```

---

## Task 4: Service (NodePort)

A **Service** exposes pods to internal or external network traffic.

```yaml
# service/nginx-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30080
  type: NodePort
```

### Commands:
```bash
kubectl apply -f service/nginx-service.yaml
kubectl get services
minikube service nginx-service --url
```

---

## Task 5: Namespace

**Namespaces** allow you to organize resources within a cluster (virtual clusters).

```yaml
# namespace/namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
---
apiVersion: v1
kind: Namespace
metadata:
  name: prod
```

### Commands:
```bash
kubectl apply -f namespace/namespaces.yaml
kubectl get namespaces
```

---

## Task 6: ConfigMap

**ConfigMap** stores non-sensitive configuration data as key-value pairs.

```yaml
# configmap/nginx-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  APP_ENV: "production"
  APP_PORT: "80"
  WELCOME_MESSAGE: "Hello from Kubernetes ConfigMap!"
```

### Commands:
```bash
kubectl apply -f configmap/nginx-configmap.yaml
kubectl get configmaps
kubectl describe configmap nginx-config
```

---

## Verification Output

### kubectl get nodes
```
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   14d   v1.37.0
```

### kubectl get all -o wide
```
NAME                                 READY   STATUS    RESTARTS   AGE
pod/nginx-pod                        1/1     Running   0          1m
pod/nginx-replicaset-pxg6f           1/1     Running   1          14d
pod/nginx-replicaset-vhlgq           1/1     Running   1          14d
pod/nginx-replicaset-x97n5           1/1     Running   1          14d

NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP        14d
service/nginx-service   NodePort    10.96.120.249   <none>        80:30080/TCP   74s

NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-deployment   3/3     3            3           74s

NAME                               DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-replicaset   3         3         3       14d
```

### kubectl get namespaces
```
NAME              STATUS   AGE
default           Active   14d
dev               Active   82s
kube-node-lease   Active   14d
kube-public       Active   14d
kube-system       Active   14d
prod              Active   82s
```

### kubectl get configmaps
```
NAME               DATA   AGE
kube-root-ca.crt   1      14d
nginx-config       3      75s
```

---

## Kubernetes Architecture Summary

| Component | Role |
|-----------|------|
| kube-apiserver | Front-end of the control plane |
| etcd | Key-value store for cluster data |
| kube-scheduler | Assigns pods to nodes |
| kube-controller-manager | Manages controllers (ReplicaSet, Deployment) |
| kubelet | Agent running on each node |
| kube-proxy | Network rules on each node |

---

## Core Objects Summary

| Object | Purpose |
|--------|---------|
| Pod | Smallest deployable unit (1+ containers) |
| ReplicaSet | Ensures N pod replicas always running |
| Deployment | Declarative updates, rollbacks, rollouts |
| Service | Exposes pods to network (ClusterIP/NodePort/LoadBalancer) |
| Namespace | Virtual clusters for multi-team isolation |
| ConfigMap | Inject config data into pods |
| Secret | Securely inject passwords, keys, tokens |