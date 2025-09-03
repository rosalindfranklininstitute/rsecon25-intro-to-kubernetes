# Introduction to Kubernetes Architecture

## Overview
Kubernetes is a powerful container orchestration platform that automates deployment, scaling, and management of containerized applications. Its architecture is divided into two main parts:

- Control Plane
- Worker Nodes

---

## Nodes

### Control plane

The **Control Plane** is the brain of the Kubernetes cluster. It manages the cluster's state and makes decisions about scheduling, scaling, and responding to events. The Control Plane has individual components running as pods on the node, each responsible for various tasks. 

#### Key Components:
- API Server - Acts as the front-end for the Kubernetes control plane. All interactions (kubectl, dashboard, etc.) go through this RESTful API. `kube-apiserver-<node-name>`

- Controller Manager - Runs controllers that handle routine tasks like node health checks, replication, and endpoint management. `kube-controller-manager-<node-name>`

- Scheduler - Assigns newly created pods to nodes based on resource availability and constraints. `kube-scheduler-<node-name>`

- etcd - A distributed key-value store that holds all cluster data (state, configuration, etc.). `etcd-<node-name>`

### Worker Nodes

Worker nodes are where your application containers actually run. Each node has the following components:

#### Key Components:
- Kubelet - An agent that runs on each node. It communicates with the API server and ensures containers are running as expected.

- Container Runtime - Software responsible for running containers (e.g., Docker, containerd).

- Kube-proxy - Handles network routing and load balancing for services within the cluster.

---
## Basic resources

### Containers: The Building Blocks

A container is a lightweight, standalone, executable package that includes everything needed to run a piece of software: code, runtime, libraries, and system tools.

Why Containers?

- **Portability**: Runs the same across environments.
- **Isolation**: Each container runs independently.
- **Efficiency**: Uses fewer resources than virtual machines.

### Pods: The Smallest Deployable Unit in Kubernetes

A pod is a group of one or more containers that share storage, network, and a specification for how to run the containers.

**Key Characteristics**:

- Containers in a pod share the same IP address and port space.
- Pods are ephemeral—if a pod dies, Kubernetes can replace it.
- Typically, a pod contains a single container, but can include sidecars (e.g., logging or proxy containers).

**Analogy**: Think of a pod as a wrapper around containers that Kubernetes can manage.


### Deployments: Managing Application Lifecycle

A deployment is a Kubernetes object that manages a set of pods and ensures the desired number of replicas are running at all times.

**Features**:

- **Declarative updates**: You define the desired state, and Kubernetes makes it happen.
- **Rollouts and rollbacks**: Easily update your application or revert to a previous version.


## How could these components work together?

1. You submit a **deployment** manifest via `kubectl apply -f`.
2. The **API Server** receives the request.
3. The **Scheduler** picks a suitable node.
4. The **Controller Manager** ensures the desired state is maintained.
5. The **Kubelet** on the chosen node pulls the container image and starts the **pod**.
6. The pod creates the relevant **containers** as the manifest describes
6. **Kube-proxy** ensures networking is set up so the pod can communicate.

---

## Minikube Architecture

During this workshop we will be demonstrating Kubernetes using Minikube to create clusters and deploy resources. Minikube is a tool that lets you run a single-node Kubernetes cluster locally on your machine. It’s designed for developers and learners who want to experiment with Kubernetes without needing a full multi-node setup.


### How standard Kubernetes architecture maps to Minikube:

| Standard Kubernetes | Minikube  |
|---------------------|---------------------|
| Control Plane       | Runs inside the Minikube VM/container |
| Worker Node         | Same VM/container acts as the worker node |
| Kubelet             | Runs inside Minikube |
| API Server          | Accessible via `kubectl` on your host |
| etcd, Scheduler, Controller Manager | All run inside the Minikube VM |

Minikube supports many standard Kubernetes features as well as third-party extensions in the form of [addons](https://minikube.sigs.k8s.io/docs/handbook/deploying/#addons).

### Key Differences:
- **Single-node setup**: Control plane and worker node are co-located.
- **Simplified networking**: Easier to manage locally.
- **Ideal for testing**: Lightweight and fast to spin up.

---

## Summary

- Kubernetes separates concerns between managing the cluster (control plane) and running workloads (worker nodes).
- Minikube mimics this architecture in a simplified, single-node environment.
- Understanding these components helps you debug, optimize, and scale your applications effectively.

## Kubernetes Architecture Overview

![The components of a Kubernetes Cluster](img/kubernetes-overview.svg)

*The components of a Kubernetes cluster. [Overview Components](https://kubernetes.io/docs/concepts/overview/components/)*

## 📚 Further Reading

- [Kubernetes project website](https://kubernetes.io/)
- [Minikube documentation](https://minikube.sigs.k8s.io/docs/)

