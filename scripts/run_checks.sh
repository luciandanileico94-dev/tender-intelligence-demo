#!/bin/sh
set -eu
python -m compileall -q tender_intelligence tests
python -m unittest discover -s tests -v
node --check static/app.js
