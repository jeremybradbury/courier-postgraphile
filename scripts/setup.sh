docker compose up -d
sleep 3
echo -n "Would you like setup the database? Existing tables will be dropped (y/N): "
read YN

if [[ $YN == 'y' ]] || [[ $YN == 'Y' ]]
then
  echo "password is 'postgres'"
    echo "type it & press enter to start with fresh data or press ctrl+c to quit"
    psql -h localhost -p 5435 -d "courier" -U "postgres" -f scripts/db.sql
fi

yarn test
echo -n "Would you like run the development environment now? (y/N): "
read YN

if [[ $YN == 'y' ]] || [[ $YN == 'Y' ]]
then
  cd scripts
  yarn dev
fi