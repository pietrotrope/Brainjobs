@echo off
for /f "skip=1 delims={}, " %%A in ('wmic nicconfig get ipaddress') do for /f "tokens=1" %%B in ("%%~A") do set "IP=%%~B"
(echo module.exports = {"port":"50000"} )> Backend/configuration.js

@echo off
for /f "skip=1 delims={}, " %%A in ('wmic nicconfig get ipaddress') do for /f "tokens=1" %%B in ("%%~A") do set "IP=%%~B"
(echo module.exports = {"ip":"%IP%", "port":"50001", "backend_port":"50000"} )> Gateway/configuration.js

@echo off
for /f "skip=1 delims={}, " %%A in ('wmic nicconfig get ipaddress') do for /f "tokens=1" %%B in ("%%~A") do set "IP=%%~B"
(echo module.exports = {"port":"50002"} )> Webserver/configuration.js

@echo off
for /f "skip=1 delims={}, " %%A in ('wmic nicconfig get ipaddress') do for /f "tokens=1" %%B in ("%%~A") do set "IP=%%~B"
(echo var gateway = {"ip":"%IP%", "port":"50001"} )> Webserver/client/gateway.js

start "" node Backend/app.js
start "" node Gateway/app.js
start "" node Webserver/app.js
