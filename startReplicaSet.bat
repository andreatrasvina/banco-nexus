@echo off
echo Iniciando nodos del Replica Set rsBanco...
echo.

REM NODO 1 - PRIMARY
start "MongoDB rs1" cmd /k "mongod --port 27018 --dbpath .\data\rs1 --replSet rsBanco"

REM NODO 2 - SECONDARY
start "MongoDB rs2" cmd /k "mongod --port 27019 --dbpath .\data\rs2 --replSet rsBanco"

REM NODO 3 - SECONDARY
start "MongoDB rs3" cmd /k "mongod --port 27020 --dbpath .\data\rs3 --replSet rsBanco"

echo Todos los nodos han sido lanzados.
pause