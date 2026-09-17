# Session 12 - Kubernetes Ingress, ConfigMaps & Secrets

**Name:** Durga Prasad  
**Enrollment Number:** 10012

---

## Overview

This session covers three critical Kubernetes features for configuration and routing:
- **ConfigMap** — Store non-sensitive configuration data
- **Secret** — Store sensitive data (passwords, tokens, keys) securely
- **Ingress** — HTTP/HTTPS routing rules into the cluster (Layer 7 load balancer)

---

## Task 1: ConfigMap

A **ConfigMap** decouples configuration from container images, making apps portable.

### YAML: `01-configmap/app-config.yaml`
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: yatri-app-config
  labels:
    app: yatri-backend
data:
  ENVIRONMENT: "production"
  LOG_LEVEL: "INFO"
  PORT: "5000"
  DEFAULT_CURRENCY: "INR"
  MAX_BOOKING_DAYS: "30"
```

### Commands & Output:
```bash
kubectl apply -f 01-configmap/app-config.yaml
kubectl get configmaps
```
```
NAME               DATA   AGE
yatri-app-config   5      1m
kube-root-ca.crt   1      14d
```

```bash
kubectl describe configmap yatri-app-config
```
```
Name:         yatri-app-config
Namespace:    default
Labels:       app=yatri-backend
Data
====
DEFAULT_CURRENCY:  INR
ENVIRONMENT:       production
LOG_LEVEL:         INFO
MAX_BOOKING_DAYS:  30
PORT:              5000
```

### Using ConfigMap in a Pod:
```yaml
envFrom:
  - configMapRef:
      name: yatri-app-config
```

---

## Task 2: Secret

A **Secret** stores sensitive data as base64-encoded values. Kubernetes keeps secrets separate from config.

### YAML: `02-secret/db-secret.yaml`
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: yatri-db-secret
type: Opaque
data:
  # echo -n "yatri_admin" | base64
  POSTGRES_USER: eWF0cmlfYWRtaW4=
  # echo -n "secretpassword" | base64
  POSTGRES_PASSWORD: c2VjcmV0cGFzc3dvcmQ=
  # echo -n "yatri_production_db" | base64
  POSTGRES_DB: eWF0cmlfcHJvZHVjdGlvbl9kYg==
```

### Creating Base64 Encoded Values:
```bash
echo -n "yatri_admin" | base64       # → eWF0cmlfYWRtaW4=
echo -n "secretpassword" | base64    # → c2VjcmV0cGFzc3dvcmQ=
echo -n "yatri_production_db" | base64  # → eWF0cmlfcHJvZHVjdGlvbl9kYg==
```

### Commands & Output:
```bash
kubectl apply -f 02-secret/db-secret.yaml
kubectl get secrets
```
```
NAME               TYPE     DATA   AGE
yatri-db-secret    Opaque   3      1m
```

```bash
kubectl describe secret yatri-db-secret
```
```
Name:         yatri-db-secret
Namespace:    default
Type:         Opaque
Data
====
POSTGRES_DB:        23 bytes
POSTGRES_PASSWORD:  14 bytes
POSTGRES_USER:      11 bytes
```

### Decode a Secret Value:
```bash
kubectl get secret yatri-db-secret -o jsonpath='{.data.POSTGRES_USER}' | base64 --decode
# Output: yatri_admin
```

### Using Secret in a Pod:
```yaml
envFrom:
  - secretRef:
      name: yatri-db-secret
```

---

## Task 3: Ingress

**Ingress** provides HTTP/HTTPS routing to services based on hostname or URL path — like a Layer 7 reverse proxy.

### Enable Ingress in Minikube:
```bash
minikube addons enable ingress
kubectl get pods -n ingress-nginx
```

### YAML: `03-ingress/ingress-routes.yaml`
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: yatri-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
    - host: yatri.local
      http:
        paths:
          - path: /api(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: yatri-backend-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: yatri-frontend-service
                port:
                  number: 80
```

### Commands & Output:
```bash
kubectl apply -f 03-ingress/
kubectl get ingress
```
```
NAME            CLASS   HOSTS        ADDRESS        PORTS   AGE
yatri-ingress   nginx   yatri.local  192.168.49.2   80      2m
```

### Test with /etc/hosts:
```bash
# Add to /etc/hosts
echo "$(minikube ip) yatri.local" | sudo tee -a /etc/hosts

# Test routing
curl http://yatri.local/        # → frontend
curl http://yatri.local/api/    # → backend
```

---

## Task 4: Full Demo — ConfigMap + Secret + Ingress Together

The `04-full-demo/` folder contains a complete working app using all three concepts together.

### Architecture:
```
                          ┌──────────────┐
Internet ──► Ingress ────► │   Frontend   │ ← Reads ConfigMap (ENVIRONMENT)
                          └──────────────┘
                                │
                          ┌──────────────┐
                          │   Backend    │ ← Reads ConfigMap + Secret (DB creds)
                          └──────────────┘
```

### Run the Full Demo:
```bash
cd 04-full-demo/
chmod +x run-demo.sh
./run-demo.sh
```

### Or apply manually:
```bash
kubectl apply -f 04-full-demo/configmap.yaml
kubectl apply -f 04-full-demo/secret.yaml
kubectl apply -f 04-full-demo/backend.yaml
kubectl apply -f 04-full-demo/frontend.yaml
kubectl apply -f 04-full-demo/ingress.yaml
```

### Verify:
```bash
kubectl get all
kubectl get configmaps
kubectl get secrets
kubectl get ingress
```

### Cleanup:
```bash
./04-full-demo/cleanup.sh
```

---

## Key Differences: ConfigMap vs Secret

| Feature | ConfigMap | Secret |
|---|---|---|
| **Data Type** | Plain text | Base64 encoded |
| **Use Case** | Non-sensitive config | Passwords, tokens, keys |
| **Storage** | etcd (plain) | etcd (encrypted at rest) |
| **RBAC** | Standard | More restrictive recommended |
| **kubectl describe** | Shows values | Hides values (shows byte count) |

---

## Troubleshooting

```bash
# ConfigMap not injected?
kubectl describe pod <pod-name> | grep -A5 "Environment"

# Secret decode check
kubectl get secret <name> -o jsonpath='{.data.<key>}' | base64 --decode

# Ingress not routing?
kubectl describe ingress <name>
kubectl get pods -n ingress-nginx    # check ingress controller is running
```

> **Note:** Always use `secretKeyRef` instead of hardcoding passwords in YAML files. Never commit plain-text secrets to Git.
