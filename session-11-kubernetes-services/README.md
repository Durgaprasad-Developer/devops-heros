# Session 11 - Kubernetes Networking & Services

**Name:** Durga Prasad  
**Enrollment Number:** 10012

---

## Overview

Kubernetes **Services** expose pods to internal or external network traffic. This session covers all 5 service types with hands-on YAML manifests and real cluster output.

---

## Service Types in Kubernetes

| Service Type | Description | Use Case |
|---|---|---|
| **ClusterIP** | Internal-only IP within the cluster | Microservice-to-microservice communication |
| **NodePort** | Exposes service on each Node's IP at a static port (30000–32767) | Dev/test external access |
| **LoadBalancer** | Cloud provider's external load balancer | Production external traffic |
| **ExternalName** | Maps service to external DNS name | Access external services by name |
| **Headless** | No ClusterIP, returns Pod IPs directly | StatefulSets, direct pod access |

---

## Task 1: ClusterIP Service

ClusterIP is the **default** service type — only accessible inside the cluster.

### YAML: `01-clusterip/service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service-clusterip
spec:
  type: ClusterIP
  selector:
    app: web-clusterip
  ports:
    - name: http
      port: 8080
      targetPort: 80
```

### Deployment: `01-clusterip/app-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-clusterip
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-clusterip
  template:
    metadata:
      labels:
        app: web-clusterip
    spec:
      containers:
        - name: nginx-web
          image: nginx:1.25-alpine
          ports:
            - containerPort: 80
```

### Commands & Output:
```bash
kubectl apply -f 01-clusterip/
kubectl get service web-service-clusterip
```
```
NAME                   TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
web-service-clusterip  ClusterIP   10.96.45.123    <none>        8080/TCP   1m
```

### Test from inside cluster:
```bash
# From a client pod inside the cluster
kubectl run client --image=busybox --rm -it --restart=Never -- wget -qO- http://web-service-clusterip:8080
```

---

## Task 2: NodePort Service

NodePort exposes the service on a **static port on every node**, accessible from outside.

### YAML: `02-nodeport/service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service-nodeport
spec:
  type: NodePort
  selector:
    app: web-nodeport
  ports:
    - name: http
      port: 80
      targetPort: 80
      nodePort: 30080
```

### Commands & Output:
```bash
kubectl apply -f 02-nodeport/
kubectl get service web-service-nodeport
```
```
NAME                  TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
web-service-nodeport  NodePort   10.96.78.200   <none>        80:30080/TCP   1m
```

```bash
# Access via minikube node IP
minikube service web-service-nodeport --url
# Output: http://192.168.49.2:30080
curl http://192.168.49.2:30080
```

---

## Task 3: LoadBalancer Service

LoadBalancer creates an **external load balancer** (cloud provider). In minikube, it stays in `<pending>` until `minikube tunnel` is run.

### YAML: `03-loadbalancer/service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service-loadbalancer
spec:
  type: LoadBalancer
  selector:
    app: web-loadbalancer
  ports:
    - name: http
      port: 80
      targetPort: 80
```

### Commands & Output:
```bash
kubectl apply -f 03-loadbalancer/
kubectl get service web-service-loadbalancer
```
```
NAME                     TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
web-service-loadbalancer LoadBalancer   10.96.90.10    <pending>      80:31200/TCP   1m
```

```bash
# Simulate external IP in minikube
minikube tunnel
kubectl get service web-service-loadbalancer
# EXTERNAL-IP becomes 127.0.0.1 after tunnel
```

---

## Task 4: ExternalName Service

ExternalName maps a service to an **external DNS name**, no proxying or load balancing.

### YAML: `04-externalname/service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-db-service
spec:
  type: ExternalName
  externalName: database.example.com
```

### Commands & Output:
```bash
kubectl apply -f 04-externalname/
kubectl get service external-db-service
```
```
NAME                 TYPE           CLUSTER-IP   EXTERNAL-IP              PORT(S)   AGE
external-db-service  ExternalName   <none>       database.example.com     <none>    1m
```

```bash
# Pods can use the service name as DNS alias
kubectl exec -it client-pod -- nslookup external-db-service
```

---

## Task 5: Headless Service

Headless services have **no ClusterIP** — DNS returns individual Pod IPs directly. Used with StatefulSets.

### YAML: `05-headless/service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-headless
spec:
  clusterIP: None
  selector:
    app: web-headless
  ports:
    - port: 80
      targetPort: 80
```

### Commands & Output:
```bash
kubectl apply -f 05-headless/
kubectl get service web-headless
```
```
NAME          TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
web-headless  ClusterIP   None         <none>        80/TCP    1m
```

```bash
# DNS returns individual pod IPs
kubectl exec -it client-pod -- nslookup web-headless
# Returns IPs of each pod directly
```

---

## DNS & FQDN in Kubernetes

Every service gets a DNS name in this format:

```
<service-name>.<namespace>.svc.cluster.local
```

| Example | Resolves To |
|---|---|
| `web-service-clusterip` | Internal ClusterIP (same namespace) |
| `web-service-clusterip.default.svc.cluster.local` | Full FQDN from any namespace |

```bash
# Test DNS resolution
kubectl run dns-test --image=busybox --rm -it --restart=Never -- nslookup web-service-clusterip.default.svc.cluster.local
```

---

## All Services Summary

```bash
kubectl get services --all-namespaces
```
```
NAMESPACE   NAME                     TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
default     kubernetes               ClusterIP      10.96.0.1      <none>        443/TCP        14d
default     web-service-clusterip    ClusterIP      10.96.45.123   <none>        8080/TCP       5m
default     web-service-nodeport     NodePort       10.96.78.200   <none>        80:30080/TCP   5m
default     web-service-loadbalancer LoadBalancer   10.96.90.10    <pending>     80:31200/TCP   5m
default     web-headless             ClusterIP      None           <none>        80/TCP         5m
```

---

## Troubleshooting Services

```bash
# Check endpoints (are pods selected?)
kubectl get endpoints <service-name>

# Describe service for events
kubectl describe service <service-name>

# Check if selector matches pod labels
kubectl get pods --show-labels
```

**Common Issue:** Empty endpoints → selector labels don't match pod labels.
