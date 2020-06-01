# running locally 
npm install
npm start  // to start the local server  open browser http://localhost:3001/ to see the app
or for developement 
npm rub devStart

# build docker image and push it into docker hub
docker build -t meshkat/sib-customer-service . 
docker tag 98d87d8167cc meshkat/sib-customer-service:latest // use the image id from the previous build command
docker push meshkat/sib-customer-service:latest


#deploy in minikube
cd ..
cd deployments/

kubectl apply -f sib-customer-service-deployment.yaml
kubectl apply -f sib-customer-service-service.yaml 
kubectl cluster-info  // collect the minikub ip address
kubectl get svc
NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes             ClusterIP   10.96.0.1        <none>        443/TCP          70m
nodeapi                NodePort    10.102.101.185   <none>        3000:30970/TCP   25m
sib-customer-service   NodePort    10.109.60.86     <none>        3001:31397/TCP   55s


browse to http://172.17.0.3:31397
