#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing python deps"
pip install -r requirements.txt

echo "==> Running migrations"
python manage.py migrate --noinput

echo "==> Collecting static"
python manage.py collectstatic --noinput

echo "==> Creating superuser (if env vars set)"
python manage.py create_default_superuser || true

echo "==> Done"
