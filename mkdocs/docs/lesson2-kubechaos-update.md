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

## 📚 Further Reading
- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
  in the official Kubernetes documentation
- [42 Kubernetes
  Projects](https://github.com/techiescamp/kubernetes-projects?tab=readme-ov-file)
for hands-on learning
