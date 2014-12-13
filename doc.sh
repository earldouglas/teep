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

pushd doc

if [ -f _doc.md ]
then
  echo 'running: rm _doc.md'
  rm _doc.md
fi

echo 'aggregating files'
for i in *.md
do
  echo "running: cat $i >> _doc.md"
  cat $i >> _doc.md

  echo "running: rm $i"
  rm $i
done

echo 'cleaning up'
sed -i '/^\* \* \*$/d' _doc.md
sed -i '/^# Global$/d' _doc.md

mv _doc.md ..

popd

rmdir doc

echo "documentation is now in `pwd`/_doc.md"
