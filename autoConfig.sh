#! /bin/bash

clear

IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

echo  "module.exports = {    port : \"50000\"}"  > "$parent_path/Backend/configuration.js"

echo  "module.exports = {
    ip : \"192.168.0.113\",
    port : \"50001\",
    backend_port : \"50000\"
}"  > "$parent_path/Gateway/configuration.js"

echo  "module.exports = {    port : \"50002\"}"  > "$parent_path/Webserver/configuration.js"

echo  "var gateway = {\"ip\" : \"192.168.0.113\",\"port\" : \"50001\"}"  > "$parent_path/Webserver/client/gateway.js"


(cd Backend && node app.js) &
(cd Gateway && node app.js) &
(cd Webserver && node app.js)
