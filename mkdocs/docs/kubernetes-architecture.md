# Introduction to Kubernetes Architecture

## Overview
Kubernetes is a powerful container orchestration platform that automates deployment, scaling, and management of containerized applications. Its architecture is divided into two main parts:

- Control Plane
- Worker Nodes

---

## 🧭 Control Plane

The **Control Plane** is the brain of the Kubernetes cluster. It manages the cluster's state and makes decisions about scheduling, scaling, and responding to events. The Control Plane has individual components running as pods on the node, each responsible for various tasks. 

#### Key Components:
- **API Server (`kube-apiserver`)**:  
  Acts as the front-end for the Kubernetes control plane. All interactions (kubectl, dashboard, etc.) go through this RESTful API.

- **Controller Manager (`kube-controller-manager`)**:  
  Runs controllers that handle routine tasks like node health checks, replication, and endpoint management.

- **Scheduler (`kube-scheduler`)**:  
  Assigns newly created pods to nodes based on resource availability and constraints.

- **etcd**:  
  A distributed key-value store that holds all cluster data (state, configuration, etc.).

---

## 🧱 Worker Nodes

Worker nodes are where your application containers actually run. Each node has the following components:

#### Key Components:
- **Kubelet**:  
  An agent that runs on each node. It communicates with the API server and ensures containers are running as expected.

- **Container Runtime**:  
  Software responsible for running containers (e.g., Docker, containerd).

- **Kube-proxy**:  
  Handles network routing and load balancing for services within the cluster.

---

## 🔄 How do these components work together?

1. You submit a deployment via `kubectl`.
2. The **API Server** receives the request.
3. The **Scheduler** picks a suitable node.
4. The **Controller Manager** ensures the desired state is maintained.
5. The **Kubelet** on the chosen node pulls the container image and starts the pod.
6. **Kube-proxy** ensures networking is set up so the pod can communicate.

---

# 🧪 Minikube Architecture

Minikube is a local Kubernetes implementation that runs a single-node cluster inside a VM or container. It’s perfect for testing and development.

## How Minikube Maps to Standard Kubernetes:

| Standard Kubernetes | Minikube Equivalent |
|---------------------|---------------------|
| Control Plane       | Runs inside the Minikube VM/container |
| Worker Node         | Same VM/container acts as the worker node |
| Kubelet             | Runs inside Minikube |
| API Server          | Accessible via `kubectl` on your host |
| etcd, Scheduler, Controller Manager | All run inside the Minikube VM |

### Key Differences:
- **Single-node setup**: Control plane and worker node are co-located.
- **Simplified networking**: Easier to manage locally.
- **Ideal for testing**: Lightweight and fast to spin up.

---

## 🧰 Summary

- Kubernetes separates concerns between managing the cluster (control plane) and running workloads (worker nodes).
- Minikube mimics this architecture in a simplified, single-node environment.
- Understanding these components helps you debug, optimize, and scale your applications effectively.

# Kubernetes Architecture Overview
```
Cluster
├── Control Plane
│   ├── API Server (kube-apiserver)
│   ├── Scheduler (kube-scheduler)
│   ├── Controller Manager (kube-controller-manager)
│   └── etcd (Key-Value Store)
│
└── Worker Nodes
    ├── Node 1
    │   ├── Kubelet
    │   ├── Container Runtime (e.g., containerd)
    │   └── Kube-proxy
    │
    └── Node N
        ├── Kubelet
        ├── Container Runtime
        └── Kube-proxy
```