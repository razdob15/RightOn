gcloud auth login 
gcloud auth configure-docker
gcloud config set project hrz-gem-ale-hac-hack-6

docker push me-west1-docker.pkg.dev/hrz-gem-ale-hac-hack-6/hackathon/frontend:v1.0.3
docker push me-west1-docker.pkg.dev/hrz-gem-ale-hac-hack-6/hackathon/backend:v1.0.3