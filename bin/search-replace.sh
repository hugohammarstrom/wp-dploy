#!/bin/bash
cwd="$1"
siteurl=$2
newurl=$3

cd $cwd

wp() {
    docker-compose run --no-deps --rm wpcli "$@"
}

wp search-replace $siteurl $newurl --all-tables --network