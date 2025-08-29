# Lesson 3: Updating with ConfigMaps
In lesson 2 you learnt how to update the Kubechaos app by making changes to the source code and then easily redeploying the app. In this lesson we will show you a way of updating your application outside of modifying the code directly. This allows you to decouple environment specific configuration from your container images, leading to ease of update and portability.

## What is a ConfigMap

A ConfigMap is a Kubernetes API object which stores data in key-value pairs. They are used for non-confidential data only, for managing confidential data you can use Secrets. Further reading on secrets can be found here. 

Pods can use the information in ConfigMaps either as environmental variables or the ConfigMap can be mounted as a volume. In this tutorial we will go through both cases and how they can be applied. 

## Configuring the Style

In web applications the style is often configured idependently of the apllication code. Kubernetes offers an easy and useful way to update pods from ConfigMaps without having to redeploy anything or rebuild the container.

We currently have a configMap running in our cluseter. You can view it either through the minikube dashboard by clicking on ConfigMap in the side bar, or by running

```
kubectl describe configmap kubechaos-style

```

This ConfigMap controls the style of the website. We can change the colours and fonts without needing to change the underlying softwre of the container.

To edit the ConfigMap type the following into a terminal
```
kubectl edit configmap kubechaos-style
```
Refresh your web browser. What has happened?

You will have noticed that some of the changes in your configMap have made changes but others have not. The fonts have changed but the colours have not. To get the colours to change run the following:
```
kubectl rollout restart deployment kubechaos
```
Refresh your web browser, what do you see now?

## Explanation

We will now look at `manifest.yml`. Please open up this file and uncomment scroll to the  block at line 22, to line 54.

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
        - name: FONT_COLOR
          valueFrom:
            configMapKeyRef:
              name: kubechaos-style
              key: font_color
        - name: BORDER_COLOR
          valueFrom:
            configMapKeyRef:
              name: kubechaos-style
              key: border_color
        - name: BORDER_SIZE
          valueFrom:
            configMapKeyRef:
              name: kubechaos-style
              key: border_size
        # can you edit this to add the BORDER_TYPE  env variable from the configMap
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



Open up the `style-config.yml` file. You will see the layout of the configMap which alters the colors of the background,borders and text. Edit some of the variables with new colours. Then apply the changes to your configMap on the cluster with:
```
kubectl apply -f deployment/style-config.yaml
```

Refresh your browser window what happens?

There is no change in the colours from the previous configuration. We need to restart the deployment in order to pick up the changes:
```
kubectl rollout restart deployment kubechaos
```
Once the  deployment has restarted you should be able to see the change in color of your configMap. This is because we injected variables from the config map into the pod as environmental variables which requires a restart for the pod to take note. This use case is ideal for applications that read configuration through environment variables. This method is straightforward and doesn't require file handling.

*Extra*
In `manifests.yaml` can you add the value of `border_style` to the enviromental variable `BORDER_STYLE` to change the border style, through the config Map?

If we mount our configMap to the container as a volume we can apply our changes diretly to the pod without restarting the deployment. This method is more used when applications are expecting configuration files rather than environmental variables.
