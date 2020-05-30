# Setting up AWS EKS (Hosted Kubernetes)

See https://www.terraform.io/docs/providers/aws/guides/eks-getting-started.html for full guide


## Download kubectl
```
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x kubectl
sudo mv kubectl /usr/local/bin
```

## Download the aws-iam-authenticator
```
wget https://github.com/kubernetes-sigs/aws-iam-authenticator/releases/download/v0.3.0/heptio-authenticator-aws_0.3.0_linux_amd64
chmod +x heptio-authenticator-aws_0.3.0_linux_amd64
sudo mv heptio-authenticator-aws_0.3.0_linux_amd64 /usr/local/bin/heptio-authenticator-aws
```

## Modify providers.tf

Choose your region. EKS is not available in every region, use the Region Table to check whether your region is supported: https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/

Make changes in providers.tf accordingly (region, optionally profile)

## Terraform apply
```
terraform init
terraform apply
```

## Configure kubectl
terraform output kubeconfig # save output in ~/.kube/config
```

terraform output kubeconfig > ~/.kube/config
export KUBECONFIG=~/.kube/config
aws eks --region eu-central-1 update-kubeconfig --name terraform-eks-demo
```

## Configure config-map-auth-aws
```
terraform output config-map-aws-auth > config-map-aws-auth.yaml
kubectl apply -f config-map-aws-auth.yaml
```

## See nodes coming up
```
kubectl get nodes
```

## test with helloworld deployment 
```
$kubectl run helloworld --image=k8s.gcr.io/echoserver:1.4 --port=8080
$kubectl expose pod helloworld --type=LoadBalancer
$kubectl get service
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP                                                                PORT(S)          AGE
helloworld   LoadBalancer   172.20.23.182   af27612ea8b5e48119a0d4b242d28540-24730900.eu-central-1.elb.amazonaws.com   8080:31294/TCP   36s
kubernetes   ClusterIP      172.20.0.1      <none>                                                                     443/TCP          21m
$curl http://af27612ea8b5e48119a0d4b242d28540-24730900.eu-central-1.elb.amazonaws.com:8080
CLIENT VALUES:
client_address=10.0.103.136
command=GET
real path=/
query=nil
request_version=1.1
request_uri=http://af27612ea8b5e48119a0d4b242d28540-24730900.eu-central-1.elb.amazonaws.com:8080/

SERVER VALUES:
server_version=nginx: 1.10.0 - lua: 10001

HEADERS RECEIVED:
accept=*/*
host=af27612ea8b5e48119a0d4b242d28540-24730900.eu-central-1.elb.amazonaws.com:8080
user-agent=curl/7.58.0
BODY:
-no body in request-
```
## Destroy
Make sure all the resources created by Kubernetes are removed (LoadBalancers, Security groups), and issue:
```
terraform destroy
```
