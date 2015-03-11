#!/usr/bin/env bash

if [ -f /usr/bin/sudo ]; then
    SUDO="/usr/bin/sudo"
else
    SUDO=""
fi

npm install
$SUDO npm install -g foreman
$SUDO npm install -g nodemon

cp ./config/dev.env .env # Copy template. Foreman reads this.
