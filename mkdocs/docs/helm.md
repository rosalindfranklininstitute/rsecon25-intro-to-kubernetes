# Lesson 4: Helm Charts
## Introduction 
Helm is a package manager for Kubernetes that provides a 
convenient way to share and install community applications.
By packaging manifests into reusable 'Charts', complex projects
can be installed with a single command, including any dependencies.
Helm handles versioning and allows customisation through
templatable values.

In this lesson, we'll deploy a community application available as
a Helm chart to our minikube cluster. 

> ⚠️  Security
>
> Like all code on the internet, Helm charts can contain malicious content.
> Only install Helm charts from trusted sources. Vetting charts using Helm's
> `template` and `verify` commands and other best practices 
> are discussed in the `sysdig` article in Further Reading. 

## Prerequisites
On Linux/WSL, Helm can be installed as a snap package
```
sudo snap install helm --classic
```
On maxOS, it is available through Homebrew
```
brew install helm
``` 
Other Windows users can use the Chocolately package manager:
```
choco install kubernetes-helm
```

You can verify your installation by running `helm version`.


## 🍹 Deploying Mocktail with Helm
[Mocktail](https://github.com/Huseyinnurbaki/mocktail) is a minimalist
server that allows you to define and test custom API endpoints.
We'll use it to demonstrate deploying using a Helm chart.

### Understanding Helm Repositories
Helm Charts can be found in two main ways:

- On community repositories like Artifact Hub, with many projects
- On individual repositories e.g. on GitHub for specific projects

Mocktail provides its own Helm repository, which we can add to
Helm with
```
helm repo add hhaluk https://huseyinnurbaki.github.io/charts/

```
It's a good idea to periodically get Helm to check for updates from added
repositories: 
```
helm repo update
```
### Deploying Mocktail
Having added the Mocktail repository, the application can be
deployed to our minikube cluster with
```
helm install mocktail hhaluk/mocktail
```
That's it! In the background, Helm organised:

- Downloading the chart and generating all necessary manifests
- Creating deployments and services
- Starting the application

### Access Monktail
Query the service
```
minikube service mocktail-svc --url
```
The URL should take you to the Mocktail dashboard.

## Optional: Test the Mock API
Try creating a custom endpoint in the dashboard:

1. Add a new GET endpoint: `/surprise`
2. Set the response:
```
{
      "message": "Hello from Kubernetes!",
      "pod": "mocktail-pod",
      "surprise": "🎲"
}
```
&nbsp;  &nbsp; 3\. Test it with curl from a Terminal:
```
curl <mocktail-dashboard-url:PORT>/mocktail/surprise
```

> 💡 The `jq` command can be used to pretty-print the JSON 
> returned by the request: `curl .../surprise | jq`

## Customising Charts with Values
A powerful feature of Helm is the ability to customise applications 
with your own parameters. First, view available configuration
options for Mocktail:
```
helm show values hhaluk/mocktail
``` 
Let's override the default `replicaCount: 1` to have three replicas
for the service. This can be done using the `--set OPTION=VALUE`
syntax for the install command:
```
helm install my-mocktail hhaluk/mocktail --set replicaCount=3
```
For larger number of changes, you can write a `custom-values.yaml`
file and apply them with
```
helm install my-custom-mocktail hhaluk/mocktail -f custom-values.yaml
```
There are a large number of 
community charts covering thousands of 
web and infrastructure projects. Charts on
[Artifact Hub](https://artifacthub.io/) may be
searched directly from the command line with
```
helm search hub <search-term>
```
You can also search in any repositories you have added. For example,
first adding the popular [Bitnami
Library](https://github.com/team-maravi/bitnami-charts):
```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```
Then
```
helm search repo <search-term>
```

📚 Further Reading 

- [Helm Documentation](https://helm.sh/)
- [Artifact Hub](https://artifacthub.io/)
- [Helm security and best
  practices](https://www.sysdig.com/blog/how-to-secure-helm)
