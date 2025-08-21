# Lesson 1: Your First Deployment

Note: The following will be written referencing the Linux/MacOS Terminal. For Windows users, please use Powershell or Command Prompt.

In this section we are going to deploy a simple web application, Kubechaos, on our minikube cluster. 
First clone this [repository](https://github.com/rosalindfranklininstitute/rsecon25-intro-to-kubernetes.git) https://github.com/rosalindfranklininstitute/rsecon25-intro-to-kubernetes.git

Open a terminal and start your minikube cluster with:

```
minikube start

```
Build the image using minikube's image build

```
minikube image build -t local/kubechaos:v1 image

```
To deploy the image on the cluster run:

```
kubectl apply -f deployment/manifests.yaml

# Wait for it to start
kubectl wait --for=condition=ready pod -l app=kubechaos

```

Now open the service in your browser
```
minikube service kubechaos-svc
```

Open the URL in your browser — every refresh is a new surprise 🎲


## What is going on?

In your terminal type in the following:

```
kubectl get pods 
```

You will get an output like this:

```
NAME                        READY   STATUS    RESTARTS   AGE
kubechaos-6d7ddd9cf-lvczb   1/1     Running   0          3s
```

Here you are looking at a pod, the smallest unit of Kubernetes deployment. It represents one or more containers running together. This pod is running the container for Kubechaos we built in the previous step. 

To learn the status of the pod we can get the logs:

```
kubectl logs <pod-name>
# The value of <pod-name> is in the output of kubectl get pods in the form kubechoas-<unique identifier>
```
You will see an output like this:
```

> kubechaos@1.0.0 start
> node app.js

Server running at http://localhost:3000

```
Let's delete the pod and see what happens:

```
kubectl delete <pod-name>
```

Now run `kubectl get pods` again to check the status of the pod. What do you notice?

You will see that another pod, with a different unique-identifier, will have been started in its place. We will find out how and why in the next section on deployments. 