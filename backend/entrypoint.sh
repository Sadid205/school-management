#!/bin/sh

set -e

echo "🚀 Starting Django container..."

# 1. migrations run
echo "📦 Running migrations..."
python manage.py makemigrations
python manage.py migrate --noinput

# 2. super admin create
echo "👤 Creating super admin if not exists..."
python manage.py create_superadmin

# 3. collect static (optional but recommended)
# echo "📁 Collecting static files..."
# python manage.py collectstatic --noinput

# 4. start server
echo "🔥 Starting server..."
python manage.py runserver 0.0.0.0:8000