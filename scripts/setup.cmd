@ECHO off
set yY=
set yn=
docker compose up -d

set /p yn="Would you like setup the database? Existing tables will be dropped (y/N): "
if "%yn%" equ "y" set yY=1
if "%yn%" equ "Y" set yy=1

if "%yY%" equ "1" (
	ECHO password is 'postgres'
	psql -h localhost -p 5435 -d "courier" -U "postgres" -f scripts/db.sql 
	set yY=
	set yn=
)
rem can only do test or dev... no need to else
set /p yn="Would you like run the tests now? (y/N): "
if "%yn%" equ "y" set yY=1
if "%yn%" equ "Y" set yy=1 
if "%yY%" equ "1" (
	yarn test
)

rem can only do test or dev... no need to else
set /p yn="Would you like run the development environment now? (y/N): "
if "%yn%" equ "y" set yY=1
if "%yn%" equ "Y" set yy=1 
if "%yY%" equ "1" (
	yarn dev
)
