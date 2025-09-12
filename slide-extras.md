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

---
# Lesson 1: kubechaos

> :warning: Note that the URL `Server running at http://localhost:3000` refers to an internal port of the container
> This **different** from the port you are accessing on your localhost.
>
Kubernetes keeps the internal container network separate from external access. To configure how services can be reached from outside the cluster we need to use an **Ingress**

---
# Lesson 3: Updating with ConfigMaps
## Extra
In `manifests.yaml` can you add the value of `border_style` to the environmental variable `BORDER_STYLE` to change the border style, through the ConfigMap?

---
# Lesson 3: Updating with ConfigMaps
