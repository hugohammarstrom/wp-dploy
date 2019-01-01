#!/bin/bash
cwd="$1"
remote_wd="$2"
host="$3"

cd $cwd

wp() {
    docker-compose run --no-deps --rm wpcli "$@"
}

ssh $host -t "cd $remote_wd; sudo wp db export wordpress.sql --allow-root"
scp $host:$remote_wd/wordpress.sql wordpress.sql
wp db import wordpress.sql