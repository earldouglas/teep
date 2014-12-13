#!/bin/bash

if [ -d doc ]
then
  echo 'running: rm doc/*.md'
  rm doc/*.md
else
  echo 'running: mkdir doc'
  mkdir doc
fi

which jsdox > /dev/null
if [ $? -ne 0 ]
then
  echo 'running: npm install jsdox'
  npm install jsdox
fi

echo 'running: jsdox lib --output doc'
jsdox lib --output doc
