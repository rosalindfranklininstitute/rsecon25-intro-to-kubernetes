# Lesson 2 Extension Task: Multiple Deployments
A Kubernetes cluster is not limited to running a single service or
deployment. Let's try something a bit more advanced - running both
the original and your modified version of the kubechaos application
at the same time, splitting traffic between them (single service).

### Remove Previous Deployment
Before attempting the dual deployment, remove the
deployment that is currently running:
```
kubectl delete deployment kubechaos
```
Check there are no deployments running with
```
kubectl get deployments
```

###  Update Your Manifest for Dual Deployments
Open `deployment/manifests.yaml` and;

  - Create an additional deployment called `kubechaos-custom`, which uses our newer version`local/kubechoas:v2`, with additional labels `spec.selector.matchLabels.version: custom` and `spec.template.metadata.labels: custom`.
  - Update the original deployment to be called `kubechaos-original` with labels for `original`.

Or simply replace `deployment/manifests.yaml` with this new specification:
<details><summary>deployment/manifests.yaml</summary>
```yaml
# Original version deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubechaos-original
  labels:
    app: kubechaos
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kubechaos
      version: original
  template:
    metadata:
      labels:
        app: kubechaos
        version: original
    spec:
      containers:
      - name: app
        image: local/kubechaos:v1  # Original version
        ports:
        - containerPort: 3000
---
# Custom version deployment  
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubechaos-custom
  labels:
    app: kubechaos
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kubechaos
      version: custom
  template:
    metadata:
      labels:
        app: kubechaos
        version: custom
    spec:
      containers:
      - name: app
        image: local/kubechaos:v2  # Your custom version
        ports:
        - containerPort: 3000
---
# Service targets both versions
apiVersion: v1
kind: Service
metadata:
  name: kubechaos-svc
spec:
  type: NodePort
  selector:
    app: kubechaos  # Unchanged
  ports:
  - name: kubechaos-port
    protocol: TCP
    port: 3000
    targetPort: 3000
```
</details>
To distinguish the deployments, we gave them different names and
their specification pods `version` labels. Note the 
`Service` specification is unchanged. In particular, the
`app: kubechaos` selector will match *both* deployments!
## Deploy and Observe
After updating the manifest, apply the new configuration:
```
kubectl apply -f deployment/manifests.yaml
```
And watch pods being created:
```
kubectl get pods -w
```
Press `Ctrl+C` when you see both pods running, 
and check the final state:
```
kubectl get deployments
```
You should now see a `kubechaos-original` 
*and* a `kubechaos-custom` deployment. 
If we now re-run the `minikube service` command
(note the URL port will have changed),
```
minikube service kubechaos-svc --url
```
you may be served either the original surprises or your
new ones. More information on the pods associated with
the service can be printed with

```
kubectl get endpointslices
```

> You may need to open additional (private) browsing
> sessions in order to get served by the other pod. Keep
> refreshing!

## 🤔 Questions 
- Why might you consistently hit the same pod even with multiple refreshes? 
- If you have hundreds of users visiting your site, how does Kubernetes decide
  which pod serves each request?
- How could you ensure the new version serves three-quarters of requests on
  average?

The answer to these questions lies with Kubernetes Services and kube-proxy -
components working behind the scenes that act as traffic directors. In
particular, kube-proxy serves as a load balancer which, by default, cycles
through pods sequentially (round-robin).

This is what makes a multi-pod deployment appear like a single, reliable
service, even though the work is actually distributed across multiple
containers!

For production systems, understanding and configuring load balancers is
essential for reliability and performance.
