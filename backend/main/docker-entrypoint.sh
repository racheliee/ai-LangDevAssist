dockerize -wait tcp://postgres:5432 -timeout 60s

echo "Running migrations"
npx prisma migrate dev --name init 

echo "Starting the server"
node /usr/src/app/dist/src/main.js
