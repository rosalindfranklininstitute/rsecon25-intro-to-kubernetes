# Lesson 1: Your First Deployment

In this lesson we are going to deploy a simple web application, called
Kubechaos, on a minikube cluster.  This will demonstrate core Kubernetes
concepts including pods, deployments, and services.

## Prerequisites 
You will need a local clone of the Kubechaos repository:
```
git clone https://github.com/rosalindfranklininstitute/rsecon25-intro-to-kubernetes.git
cd rsecon25-intro-to-kubernetes
```
Check your cluster from the previous lesson is still running
(`minikube start` if it is not):
```
minikube status
```

## Building the Container Image
Kubernetes runs applications in containers, but does not handle building
container images itself&mdash;it expects images to already be available.
Minikube provides a convenient build tool that allows us to
create a Docker image (defined in `image/Dockerfile`) for the Kubechaos app:
```
minikube image build -t local/kubechaos:v1 image
```
The built image is stored in minikube's local registry, identified
in the output of the command `minikube image ls`
by the tag `local/kubchaos:v1`.

## Inspecting the Manifest
A Kubernetes manifest is a YAML file that defines the target state of
resources in a cluster. If you open `deployment/manifests.yaml`,
you'll see it contains definitions for:

- A Deployment (manages pods)
- A Service (provides networking)
- A ConfigMap (explored in lesson 3)

Notice the image tag `local/kubechaos:v1` in the manifest
matches what we just built.

## Application Deployment
The `kubectl apply` command deploys resources in manifest files to a cluster:
```
kubectl apply -f deployment/manifests.yaml
```
For large applications, it can be useful to know when a pod is ready:
```
kubectl wait --for=condition=ready pod -l app=kubechaos
```
> The `-l app=kubechaos` flag targets pods with the label `app=kubechaos`
> seen in the manifest.

You can now view the app in your browser by using minkube's service command to
create a proxy to the container:
```
minikube service kubechaos-svc
```
Open the returned URL in your browser&mdash;every refresh is a new surprise 🎲

## Pods and Logs
Let's examine what was created on the cluster. In the terminal, list
the running pods:
```
kubectl get pods 
```
You will get output similar to:
```
NAME                        READY   STATUS    RESTARTS   AGE
kubechaos-6d7ddd9cf-lvczb   1/1     Running   0          3s
```
Pods are the smallest unit of Kubernetes deployment. They
 represents one or more containers running together. 
In this case, we have a Kubechaos pod with a single (1/1) container running.
You can check the pod has also appeared in the Web Dashboard
under `Workloads > Pods`.

To learn the status of the pod we can view the logs:
```
kubectl logs kubechaos-<id>
```
where you will need to replace `<id>` with the unique identifier 
that was shown under `NAME` when you ran the `get pods` command.
You will see a record of the node.js app starting inside
the container:
```
> kubechaos@1.0.0 start
> node app.js

Server running at http://localhost:3000
```
Note that the URL here refers to an internal port of the container, which
is different from the port the minikube proxy exposed on 
your localhost for accessing the service from outside the cluster.
In general
Kubernetes keeps the internal container network separate from
external access, and you need to explicitly configure how services can be
reached from outside the cluster (see [Ingress](#ingress-production-ready-external-access)
below).

## Deletion Experiment
Let's see what happens if we delete the pod from the cluster:
```
kubectl delete pod <pod-name>
```

Now run `kubectl get pods` again, what do you notice?

You will see that a new pod, with a different unique-identifier, 
was started in place of the removed one. This *self-healing* is a key
feature of Kubernetes' deployments.

## Delving into Deployments
A Deployment is a Kubernetes resource that manages the desired state of an
application. Looking back at the manifest file (deployment/manifests.yaml), the
Deployment section defined how many replicas of the application container should run,
which image to use, and further configuration.  This is an
example of a *declarative* approach: you declare the target state, and
Kubernetes figures out how to attain&mdash;and then maintain&mdash;it.

### Replica Sets
Deployments don't directly manage pods. Instead, they work through *ReplicaSets*
which are responsible for creating the individual pods. In summary,

**Deployment → ReplicaSet → Pods**

Where *Deployment* defines the target state, *ReplicaSet*
ensures the correct number of replicas are alive, and *Pods* are the
actual App instances.

### Self-healing and Scaling
We have already seen self-healing in action: when a pod was deleted the
ReplicaSet detected the live state (0 pods) didn't match the 
desired state (1 pod) and so created a replacement. This automatic recovery ensures
applications can remain available even when individual pods fail.

Another key feature of Kubernetes' deployments is *scaling*. Suppose we want
to scale up to three replicas to support more concurrent requests or ensure
better availability.

First, let's set up a watch to monitor the pods in real-time:
```
kubectl get pods -w
```
Next, in a new terminal, run the following `kubectl scale` command:
```
kubectl scale deployment kubechaos --replicas=3
```
In the first terminal you will see in two additional replicas being spun up
immediately! You can verify the new state with `kubectl get deployment`
or by reviewing the Deployments/Pods page in the Web Dashboard.

## Ingress: Production-Ready External Access
In networking terminology, "ingress" refers to incoming traffic, and "egress"
outgoing traffic. For infrastructure and cloud computing, ingress describes
how external clients access services running inside a protected network.

You won't be surprised to learn that Ingress in Kubernetes is also a resource.
Specifically, it
defines rules for routing HTTP/HTTPS traffic from outside the cluster to
services within it. These rules are implemented by a load balancer component
(like nginx) called an Ingress Controller. 
A simplified traffic flow is:
```
External Client → Ingress Controller + Rules → Service → Pod
```
where the Service groups pods running your application. 

## Beyond minikube service
Above, we used the `minikube service` command, which
creates a temporary proxy from your local machine to the application
containers.
While convenient for development, this approach is limited to basic port forwarding.

For production, you'll need the proper HTTPS routing with DNS,
SSL/TLS termination and advanced load balancing provided by
Kubernetes Ingress. Minikube supports Kubernetes Ingress with the
`ingress` add-on (see Further Reading).

## 📚 Further Reading
- [Official kubectl Quick Reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/)
- [The Kubernetes Networking Guide](https://www.tkng.io/) 
- [Ingress DNS minikube add-on](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/#Linux)



