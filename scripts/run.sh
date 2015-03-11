#!/usr/bin/env bash
nf --procfile ./config/Procfile.dev -e ./config/dev.env start
