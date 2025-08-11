# 📖 README — KubeChaos @ RSECon25

## 🎯 About

KubeChaos is a tiny Node.js single-page app that serves a **random surprise** every time you refresh — random facts, Kubernetes "jokes" (from ChatGPT!) and mini-games.

It’s perfect for testing Kubernetes basics on **Minikube** or running locally in Docker/Podman.

---

## 🛠 Prerequisites

Before you start, you’ll need:

1. **[Node.js](https://nodejs.org/en/download)** (only if running locally without Docker)
2. **Container runtime** (choose one):

   * [Docker](https://docs.docker.com/get-docker/)
   * [Podman](https://podman.io/getting-started/installation)
3. **[Minikube](https://minikube.sigs.k8s.io/docs/start/)** (for running in Kubernetes)
4. **[kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)** (Kubernetes CLI)

---

### 📥 Install Links by OS

#### **Windows**

* Docker Desktop: [https://docs.docker.com/desktop/install/windows/](https://docs.docker.com/desktop/install/windows/)
* Podman: [https://podman.io/getting-started/installation#installing-on-windows](https://podman.io/getting-started/installation#installing-on-windows)
* Minikube: [https://minikube.sigs.k8s.io/docs/start/#windows](https://minikube.sigs.k8s.io/docs/start/#windows)
* kubectl: [https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

#### **macOS**

* Docker Desktop: [https://docs.docker.com/desktop/install/mac/](https://docs.docker.com/desktop/install/mac/)
* Podman: [https://podman.io/getting-started/installation#installing-on-macos](https://podman.io/getting-started/installation#installing-on-macos)
* Minikube: [https://minikube.sigs.k8s.io/docs/start/#macos](https://minikube.sigs.k8s.io/docs/start/#macos)
* kubectl: [https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)

#### **Linux**

* Docker: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
* Podman: [https://podman.io/getting-started/installation#installing-on-linux](https://podman.io/getting-started/installation#installing-on-linux)
* Minikube: [https://minikube.sigs.k8s.io/docs/start/#linux](https://minikube.sigs.k8s.io/docs/start/#linux)
* kubectl: [https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

---

## ☸ Running on Minikube

```bash
# Start Minikube
minikube start

# Build the container image
minikube image build -t local/kubechaos:v1 image

# Deploy the app to kubernetes
kubectl apply -f deployment/manifests.yaml

# Wait for it to start
kubectl wait --for=condition=ready pod -l app=kubechaos

# Open the service in your browser
minikube service kubechaos-svc
```

Open the URL in your browser — every refresh is a new surprise 🎲

---

## 🚀 Scaling the deployment

* Scale the deployment to demonstrate load balancing:

  ```bash
  kubectl scale deployment kubechaos --replicas=3
  ```
* Refresh multiple times — different pods may serve different surprises.
* Use this as an intro to **rolling updates** by rebuilding the image with new surprises and running:

  ```bash
  kubectl set image deployment/kubechaos kubechaos=<your-new-image>
  ```

---

## 🔄 Deploying updates

```bash
# Rebuild the image (not changing the tag, for simplicity)
minikube image build -t local/kubechaos:v1 image

# Restart the deployment
kubectl rollout restart deploy kubechaos

# Check the deployment
kubectl rollout status deployment kubechaos

# Tip: you can watch the pods update in real-time
kubectl get pods -w
```

---

## 💡 Optional - Running Locally with Docker or Podman

Optionally, you can run the container with Docker/Podman directly, if you want to try the container outside of Kubernetes.

```bash
# Build the image
docker build -t kubechaos:v1 image

# Run the container
docker run -p 3000:3000 kubechaos:v1
```

Visit: **[http://localhost:3000](http://localhost:3000)**

> **Podman users:** Replace `docker` with `podman` in the above commands.
