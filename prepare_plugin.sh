#!/bin/bash
VERSION=alpha3

cp -r !(prepare_plugin.sh) ../extension_mnopi

cd ..
zip -r mnopiBackend/mnopi/static/mnopi/plugin-mnopi-$VERSION.zip extension_mnopi
