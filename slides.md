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
- <span style="color:green">Green</span> typically mean healthy/running, <span style="color:gold">yellow</span> pending/updating, and <span style="color:red">red</span> an  error state
- Click on any resource name to get detailed information and logs

--
