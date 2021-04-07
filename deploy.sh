docker build -t suguiura/multi-client:latest -t suguiura/multi-client:${SHA} -f ./client/Dockerfile ./client
docker build -t suguiura/multi-server:latest -t suguiura/multi-server:${SHA} -f ./server/Dockerfile ./server
docker build -t suguiura/multi-worker:latest -t suguiura/multi-worker:${SHA} -f ./worker/Dockerfile ./worker

docker push suguiura/multi-client:latest
docker push suguiura/multi-server:latest
docker push suguiura/multi-worker:latest

docker push suguiura/multi-client:${SHA}
docker push suguiura/multi-server:${SHA}
docker push suguiura/multi-worker:${SHA}

kubectl apply -f k8s

kubectl set image deployment/client-deployment client=suguiura/multi-client:${SHA}
kubectl set image deployment/server-deployment server=suguiura/multi-server:${SHA}
kubectl set image deployment/worker-deployment worker=suguiura/multi-worker:${SHA}
