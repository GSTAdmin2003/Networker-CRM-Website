#!/usr/bin/env bash
#
# Deploy / update the marketing site on the Hetzner box (same box as the
# CRM, separate compose project). Mirrors /opt/crm/deploy/deploy-hetzner.sh's
# own shape.
#
#   bash deploy.sh              # pull, build, restart
#   SKIP_PULL=1 bash deploy.sh  # deploy what is already checked out
#
set -euo pipefail

DEPLOY_DIR="${DEPLOY_DIR:-/opt/networker-website}"
cd "$DEPLOY_DIR"

if [ ! -f .env ]; then
	echo "No .env at ${DEPLOY_DIR}/.env -- copy .env.example and fill it in."
	exit 1
fi

echo "=== Deploying networker-website ==="

if [ "${SKIP_PULL:-0}" != "1" ]; then
	echo "--- Pulling ---"
	git pull origin "$(git branch --show-current)"
fi

echo "--- Building ---"
docker compose --env-file .env build

echo "--- Starting ---"
docker compose --env-file .env up -d --remove-orphans

echo "--- Waiting for web to respond ---"
for _ in $(seq 1 20); do
	if docker compose --env-file .env exec -T web wget -qO- http://localhost:3000/ > /dev/null 2>&1; then
		echo "web: responding"
		break
	fi
	sleep 3
done

docker compose --env-file .env ps

cat <<-EOF

	=== Deploy complete ===
	Logs:    docker compose --env-file .env logs -f web
	Status:  docker compose --env-file .env ps
EOF
