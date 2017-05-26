#!/bin/bash

BASEDIR=$(dirname "$0")
if [ $# -eq 1 ]; then
    echo "Downloading from $1"
else
    echo "URL is required"
    exit 1
fi

URL=$1
NAME=$URL
NAME=${NAME#${NAME%/*}}
NAME=${NAME%.*}
NAME=${NAME#/*}
NAME=${NAME#*-}
echo "Downloading into $NAME"

DIR=$PWD

if [[ -d $NAME ]]
then
    echo "$NAME already exists. Aborting..."
    exit 2
    rm -rf $NAME
fi

mkdir $NAME && cd $NAME

$DIR/asbook.js $URL | xargs -n 2 wget -O

cd $DIR
