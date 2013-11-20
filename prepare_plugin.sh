#!/bin/bash

cp -r !(prepare_plugin.sh) ../extension_mnopi

cd ..
zip -r mnopiBackend/mnopi/static/mnopi/plugin-mnopi-v0.1.zip extension_mnopi