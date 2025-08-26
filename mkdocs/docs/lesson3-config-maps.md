# Lesson 3: Updating with ConfigMaps
In lesson 2 you learnt how to update the Kubechaos app by making changes to the source code and then easily redeploying the app. In this lesson we will show you a way of updating your application outside of modifying the code directly. This allows you to decouple environment specific configuration from your container images, leading to ease of update and portability.

## What is a ConfigMap

A ConfigMap is a Kubernetes API object which stores data in key-value pairs. They are used for non-confidential data only, for managing confidential data you can use Secrets. Further reading on secrets can be found here. 

Pods can use the information in ConfigMaps either as environmental variables or the ConfigMap can be mounted as a volume. In this tutorial we will go through both cases and how they can be applied. 

