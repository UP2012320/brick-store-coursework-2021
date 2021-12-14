#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ $VERCEL_GIT_COMMIT_REF == "nx-port" ]] || [[ $VERCEL_GIT_COMMIT_REF == "old" ]] || [[ $VERCEL_GIT_COMMIT_REF == "framework_rewrite" ]]; then
  exit 0
fi

exit 1
