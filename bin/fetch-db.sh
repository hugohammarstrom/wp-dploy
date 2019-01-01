#!/bin/bash
cwd="$1"
remote_wd="$2"
host="$3"

cd $cwd

wp() {
    docker-compose run --no-deps --rm wpcli "$@"
}

echo "dploy: exporting database on server"
ssh $host -t "cd $remote_wd; sudo wp db export wordpress.sql --allow-root"
echo "dploy: downloading database from server"
scp $host:$remote_wd/wordpress.sql wordpress.sql
echo "dploy: downloaded database"
wp db import wordpress.sql
echo "dploy: imported database to local environment"