---
marp: true
theme: default
paginate: true
header:
  <img src='./mkdocs/docs/assets/CN-SIG-logo.png' width='200px' style='padding-left:1050px'></img>
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
Authors: Laura Shemilt, Lewis Sampson, Piper Fowler-Wright and Alex Lubbock


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

---
# Lesson 2: Updating the Kubechaos App
*How do you update a running application without breaking it?*

In this lesson, we'll explore redeployment in Kubernetes by applying changes to both the application image and specification.

---
# Lesson 2: Updating the Kubechaos App
Open `image/app.js` and find the `suprises` variable (line 7):

```javascript
const surprises = [
  `<h2>🎯 Click the target!</h2>
   <div style="font-size:100px;cursor:pointer;" onclick="alert('You hit it! 🎉')">🎯</div>`,

  `<h2>😂 Joke of the moment</h2>
   <p>Why did the dolphin get a job in Kubernetes?<br>Because it already knew how to work in pods.</p>`,

  // ... more entries
];
```
---
# Lesson 2: Updating the Kubechaos App
Your tasks:

1. Add 2-3 of you own surprises with jokes or other HTML content
2. Remove the original surprise elements
3. Finally, locate the "KubeChaos @ RSECon25!" title and replace it with "<your-name\> @ RSECon25!"


> ⚠️  JavaScript Array Syntax:
>
> - Each element is wrapped in backticks `\` (multi-line strings)
> - Elements are separated by commas

---
# Lesson 2: Updating the Kubechaos App
Once you've made your changes, build a new container image with a `v2` tag:
```
minikube image build -t local/kubechaos:v2 image
```
Verify your new image was created:
```
minikube image ls
```
You should see  both `local/kubechaos:v1` and `local/kubechaos:v2` listed.

---
# Lesson 2: Updating the Kubechaos App
Open `deployment/manifests.yaml` and update the container's image tag:
```yaml
    spec:
      containers:
      - name: app
        image: local/kubechaos:v2  # Changed from v1
```
Make sure to save the file then apply your changes to the cluster:
```
kubectl apply -f deployment/manifests.yaml
```
Check when the deployment is complete:
```
kubectl rollout status deployment kubechaos
```
---
# Lesson 2: Updating the Kubechaos App
Return to the browser window/URL with the running application - on refresh you should now see your own jokes and custom title!
> 💡 If we had simply modified and rebuilt the `v1` image, it would have been sufficient to restart the deployment (`kubectl rollout restart deploy kubechaos`).
> Since we changed the manifest, however, a redeployment is necessary.

---
# Lesson 2: Updating the Kubechaos App

## Summary
* Updated the container image
* Redeployed the application with a single command
* No need to restart or rebuild systems for a redeploy

---
# Lesson 3: Updating with ConfigMaps
* In lesson 2 you learnt how to update the Kubechaos app by making changes to the source code and then easily redeploying the app.
* In this lesson we will update the application without modifying the code using ConfigMaps

### What is a ConfigMap ?

* It is a Kubernetes API object which stores data in key-value pairs.
* Non-confidential data only

Pods can use the information in ConfigMaps either as:
* environmental variables
* mounted as a volume.

---
# Lesson 3: Updating with ConfigMaps
## Configuring the Style with Environmental variables

In web applications the style is often configured idependently of the application code.

We currently have a configMap running in our cluster. View it either through the minikube dashboard or with:

```
kubectl describe configmap kubechaos-style

```
---
# Lesson 3: Updating with ConfigMaps

```
Name:         kubechaos-style
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
border_color:
----
grey

border_size:
----
8px

border_style:
----
dotted

font_color:
----
white

style.css:
----
body { font-family: 'garamond';
       text-align: left;
       margin-top: 10rem;}

bg_color:
----
teal

BinaryData
====

Events:  <none>
```
---
# Lesson 3: Updating with ConfigMaps
This ConfigMap controls the style of the website. .

Change the colors and border of the web application. To edit the ConfigMap:
```
kubectl edit configmap kubechaos-style
```

---
# Lesson 3: Updating with ConfigMaps
Change the following variables:
```
  bg_color:  white
  font_color: black
  border_color: black
  border_size: 4px
  border_style: dashed

```
> ⚠️  Note you will need to use specific variables for colors:
>  - they can be in hex rgb format e.g. #000000 or #0000ff
>  - or they can be in css names e.g. black or blue

Refresh your web browser. What has happened?

---
# Lesson 3: Updating with ConfigMaps
You will have noticed that your changes have not been applied, the styling remains the same.

To get the colours to change run the following:
```
kubectl rollout restart deployment kubechaos
```
Refresh your web browser, what do you see now?

---
# Lesson 3: Updating with ConfigMaps
### Explanation

The variables that you edited in the ConfigMap are applied as **environmental variables**.
 To get the pod to pick up on it's new environment it needs to be remade. The quickest way to restart everything is to use the `kubectl rollout restart` command we used above.

 ---
 # Lesson 3: Updating with ConfigMaps
We will now look at `manifest.yml`. Please open up this file and scroll to the  block at line 22, to line 44. In this part of the deploymnet we set the `env` section of the container with values from the ConfigMap.

```
    spec:
      containers:
      - name: app
        image: local/kubechaos:v1
        ports:
        - containerPort: 3000
        env:
        - name: BG_COLOR
          valueFrom:
            configMapKeyRef:
              name: kubechaos-style
              key: bg_color
     ...
```
---
# Lesson 3: Updating with ConfigMaps
In this section we injected variables from the ConfigMap into the pod as environmental variables to make changes without having to rebuild the image:
 * ideal for applications that read configuration through environment variables
 *  doesn't require file handling
 * Requires restart for changes to take effect.

Now we will look at mounting our ConfigMap as a volume. This method is used when applications are expecting **configuration files** rather than **environmental variables**.

---
# Lesson 3: Updating with ConfigMaps

Usually a website's style is configured through a `.css` file, rather than  environmental variables.

Look ConfigMap either through the Minikube Dashboard or with:
`kubectl describe configmap style-kubechaos`
There is a definition of a css file :

```
style.css:
----
body { font-family: 'sans-serif';
       text-align: center;
       margin-top: 5rem;}

```
---
# Lesson 3: Updating with ConfigMaps
Now let's edit these variables in the ConfigMap keeping the structure of the file intact:
```
kubectl edit configmap style-kubechoas
```
Refresh your browser? What happens now?
> ⚠️  Note you will need to use specific variables for `font-family and `text-align`:
>  - `text-align` can be `center`, `right`, `left`
>  - `font-family` has to belong to the websafe fonts e.g. `serif`, `arial`, `garamond`

---
# Lesson 3: Updating with ConfigMaps

## Explanation

Here we are mounting a file as a volume into the pod. The file is being written by the values in the in the ConfigMap. When we change the values they are immediately picked up by the pod without it being restarted.

---
# Lesson 3: Updating with ConfigMaps

Open the `manifest.yml` and scroll to line 44 to 54:

```   container:
            ...
        volumeMounts:
        - name: style-env
          mountPath: "/src/public/"
          readOnly: true
      volumes:
      - name: style-env
        configMap:
          name: kubechaos-style
          items:
            - key: "style.css"
              path: "style.css"
```

This creates a volume called `style-env` and  mounts it as a volume. This volume has  the `style.css` file  mounted on the path the application expects.

---
# Lesson 3: Updating with ConfigMaps
To see the mainfest of the original ConfigMap (before our edits) you can scroll down to line 73 in `manifests.yml`:

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: kubechaos-style
data:
  bg_color:  white
  font_color: black
...

  style.css: |
    body { font-family: 'sans-serif';
   ...
           }

```
---
# Lesson 3: Updating Config Maps
### Summary:
* ConfigMaps are key-value pair API objects
* They can be used to inject environmental variables or as volumes
* You can update your application without changing the code or the deployment
* environmental variables require restarts, volumes do not
* For a production system you can version control your changes to a ConfigMap as a manifest and apply it to your cluster.