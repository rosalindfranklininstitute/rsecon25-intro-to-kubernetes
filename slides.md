---
marp: true
theme: default
paginate: true

---
<style>
section {
  background: white;
  color: black
}
h1 {color: teal}

.centered-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>

# Deploying a Web Application with Kubernetes
## A Cloud Native SIG Workshop
### RSECon25 Thursday 11th September
Authors: Laura Shemilt, Lewis Sampon, Piper Fowler-Wright and Alex Lubbock


---
# Why Kubernetes?
- Scalability and High Availability
- Self-Healing and Reliability
- Declarative Configuration and Rolling Updates
- Resource Management
- Networking
- Security
- Extensibility and Ecosystem
- Stateful Applications
- Backup and Restore
---
# Kubernetes Architecture

---
# Lesson 0: Minikube Dashboard
First, start a cluster if you have not already:
```bash
minikube start
```
Then, launch the dashboard with
```bash
minikube dashboard
```
---
# Lesson 0: Minikube Dashboard
<img src="mkdocs/docs/images/kubernetes-dashboard-system-information.png" width=750; class=centered-image/>

---
# Lesson 0: Minikube Dashboard
Namespaces: provide a way to organise and isolate
resources within a cluster.

Click on Namespaces in the sidebar of the minikube dashboard

- In this workshop, we will work in the *default* namespace
- In the real-world, you may want to use
namespaces to divide resourcess (e.g.,`dev`, `prod`)

---
# Lesson 0: Minikube Dashboard
## 💡 Tips
- Keep the dashboard open to see the effect of `kubectl` commands in real-time
- <span style="color:green">Green</span> typically mean healthy/running, <span style="color:orange">yellow</span> pending/updating, and <span style="color:red">red</span> an  error state
- Click on any resource name to get detailed information and logs

---
# Lesson 1: Kubechaos
In this lesson we are going to launch our first application on Kubernetes!
Make a local clone of Kubechaos repository:
```
git clone https://github.com/rosalindfranklininstitute/rsecon25-intro-to-kubernetes.git
cd rsecon25-intro-to-kubernetes
```
Check your cluster from the previous lesson is still running(`minikube start` if it is not):
```
minikube status
```
---
# Lesson 1: Kubechaos
Using minikube's build tool create a Docker image (defined in `image/Dockerfile`) for the Kubechaos app:
```
minikube image build -t local/kubechaos:v1 image
```

A Kubernetes **manifest** defines the target state of resources in a cluster.
Open `deployment/manifests.yaml`, it contains definitions for:

- A Deployment (manages pods)
- A Service (provides networking)
- A ConfigMap (we'll explore that later)

The image tag `local/kubechaos:v1` in the manifest matches what we just built.

---
# Lesson 1: Kubechaos

To deploy the app:
```
kubectl apply -f deployment/manifests.yaml
```
For large applications, it can be useful to know when a pod is ready:
```
kubectl wait --for=condition=ready pod -l app=kubechaos
```
View the app in your browser by using:
```
minikube service kubechaos-svc
```
**Open the returned URL in your browser&mdash;every refresh is a new surprise 🎲**

---
# Lesson 1: Kubechaos
## Pods
List  the running pods (or in Minikube Dashboard under `Workloads > Pods`):
```
kubectl get pods
```
You will get output similar to:
```
NAME                        READY   STATUS    RESTARTS   AGE
kubechaos-6d7ddd9cf-lvczb   1/1     Running   0          3s
```
**Pods** are the **smallest unit** of Kubernetes **deployment** representing containers running together.

---
# Lesson 1: Kubechaos
## Logs
To view the pod logs:
```
kubectl logs kubechaos-<id>
```
replace `<id>` with the unique identifier that was shown under `NAME` when you ran the `get pods` command.
You will see a record of the node.js app starting inside the container:
```
> kubechaos@1.0.0 start
> node app.js

Server running at http://localhost:3000
```

---
# Lesson 1: Kubechaos
## Deletion Experiment
Let's see what happens if we delete the pod from the cluster:
```
kubectl delete <pod-name>
```

Now run `kubectl get pods` again, what do you notice?

---
# Lesson 1: Kubechaos
* A new pod is created with a different unique-identifier
* The cluster has *self-healed*

 **Why?**
A *Deployment* is a Kubernetes resource that manages the desired state of an application.

 **Declarative approach**
  Declare the target state **&rarr;** Kubernetes figures out how to attain and then maintain.

 Therefore when you delete a pod a new one will be created in its place to maintain the state.

 ---
# Lesson 1: Kubechaos


### Replica Sets
Deployments don't directly manage pods. Instead, they work through *ReplicaSets* which are responsible for creating the individual pods.

**Deployment → ReplicaSet → Pods**

Where *Deployment* defines the target state, *ReplicaSet*
ensures the correct number of replicas are alive, and *Pods* are the
actual App instances.

---
# Lesson 1: Kubechaos
Let's take a look at the  Deployment section of `deployments/manifest.yaml` here we can see the definition of te Replica Set.
```
apiVersion: apps/v1
kind: Deployment
metadata: ...
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kubechaos
  template:
    metadata:
      labels:
        app: kubechaos

````
---
# Lesson 1: Kubechaos
then we have description of the application container that will be runningin in the pod
```
    spec:
      containers:
      - name: app
        image: local/kubechaos:v1
        ports:
        - containerPort: 3000

````
---
# Lesson 1: Kubechaos
## Scaling
We want to scale up to three replicas to support more concurrent requests or ensure better availability.
Let's set up a watch to monitor the pods in real-time:
```
kubectl get pods -w
```
Next, in a new terminal, run the following `kubectl scale` command:
```
kubectl scale deployment kubechaos --replicas=3
```
What do you see?

---
# Lesson 1: Kubechaos
In the first terminal you will see in two additional replicas being spun up
immediately!

You can verify the new state with
```kubectl get deployment```
or by reviewing the Deployments/Pods page in the Web Dashboard.

---
# Lesson 1: Kubechaos
## Summary
* Deployed a web application on Kubernetes
* Deleted a pod and watched it self heal
* Learnt Kubernetes concepts of Pods, Deployments and Replica Sets.
* Scaled the deployment to 3 replica sets