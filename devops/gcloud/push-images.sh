gcloud auth login 
gcloud auth configure-docker
gcloud config set project hrz-gem-ale-hac-hack-6

TAG=$1

if [ -z "$TAG" ]; then
  echo "Error: TAG argument is required."
  echo "Usage: $0 <TAG>"
  exit 1
fi

docker push me-west1-docker.pkg.dev/hrz-gem-ale-hac-hack-6/hackathon/frontend:$TAG
docker push me-west1-docker.pkg.dev/hrz-gem-ale-hac-hack-6/hackathon/backend:$TAG