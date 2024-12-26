#!/bin/bash

# Start all indexers
echo "Starting all indexers..."
for indexer in src/indexers/*.ts; do
  echo "Running $indexer..."
  apibara run "$indexer" --allow-env=.env --sink-id "$indexer" --persist-to-redis "$REDIS_URL" &
done

# Wait for all background processes to finish
wait
echo "All indexers started."

apibara run src/indexers/withdraw.indexer.ts --allow-env=.env
