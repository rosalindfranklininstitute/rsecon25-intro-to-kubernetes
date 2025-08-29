# Lesson 2: Updating the Kubechaos App
How do you update a running application without breaking it? In this lesson,
we'll explore redeployment in Kubernetes by applying changes to both the
application image and specification. 


## Step 1: Customise the Application
Open `image/app.js` and find the `suprises` variable (line 7).
This is a JavaScript array where each element is a string with HTML content:
```javascript
const surprises = [
  `<h2>🎯 Click the target!</h2>
   <div style="font-size:100px;cursor:pointer;" onclick="alert('You hit it! 🎉')">🎯</div>`,

  `<h2>😂 Joke of the moment</h2>
   <p>Why did the dolphin get a job in Kubernetes?<br>Because it already knew how to work in pods.</p>`,
   
  // ... more entries
];
```
You tasks:

1. Add 2-3 of you own surprises with jokes or other HTML content
2. Remove the original surprise elements
3. Finally, locate the "KubeChaos @ RSECon25!" title and replace it with "<your-name\> @ RSECon25!"


> ⚠️  JavaScript Array Syntax:
>
> - Each element is wrapped in backticks \` (multi-line strings)
> - Elements are separated by commas


### Building the New Image
Once you've made your changes, build a new container image with a `v2` tag:
```
minikube image build -t local/kubechaos:v2 image
```
Verify your new image was created:
```
minikube image ls
```
You should see  both `local/kubechaos:v1` and 
`local/kubechaos:v2` listed.

## Step 2: Update and Redeploy
Now let's update your deployment to use the new image.
### Update the manifest
Open `deployment/manifests.yaml` and update the image tag used by the container:
```yaml
    spec:
      containers:
      - name: app
        image: local/kubechaos:v2  # Changed from v1
```
Make sure to save the file.
### Redeploy the Application:
Apply your changes to the cluster:
```
kubectl apply -f deployment/manifests.yaml
```
Check when the deployment is complete:
```
kubectl rollout status deployment kubechaos
```
> 💡 If we had simply modified and rebuilt the `v1` image,
> it would have been sufficient to restart the
> deployment (`kubectl rollout restart deploy kubechaos`).
> Since we changed the manifest, however, a redeployment 
> is necessary. 

### Test Your Changes
Return to the browser window/URL with the running application -
on refresh you should now see your own jokes and custom title!

> If you closed the browser window, you can get the service
> URL from `minikube service kubechaos-svc --url` as before.

## Extension Task: Multiple Deployments
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
Replace `deployment/manifests.yaml` with this new specification:
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
minikube service kubechaos-svc
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

## 📚 Further Reading
- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
  in the official Kubernetes documentation
- [42 Kubernetes
  Projects](https://github.com/techiescamp/kubernetes-projects?tab=readme-ov-file)
for hands-on learning
