#!/bin/bash

cp -r !(prepare_plugin.sh) ../server_plugin

cd ..
zip -r mnopiBackend/mnopi/static/mnopi/plugin-mnopi-v0.1.zip server_plugin