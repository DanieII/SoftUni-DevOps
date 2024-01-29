docker run -d --name ls-server -p 80:8080 lightstreamer

docker run -d --name ghost-container -p 3001:2368 -e NODE_ENV=development ghost

docker run -d --name my-apache-app -p 8080:80 -v ${pwd}/:/usr/local/apache2/htdocs/ httpd

docker run -d -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=yourStrongPassword12# -p 1433:1433 -v sqldata:/var/opt/mssql mcr.microsoft.com/mssql/server

docker network create mariadb
docker run -d --name some-mariadb --network mariadb -e MARIADB_ROOT_PASSWORD=my-secret-pw mariadb
docker run -it --network mariadb --rm mariadb mariadb -hsome-mariadb -uroot -p


docker build -t name/tracker_app .
docker run -d -p 80:80 --name tracker_app name/tracker_app

docker run -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=yourStrongPassword12# -p 1433:1433 --name sqlserver --network taskboard --rm -d mcr.microsoft.com/mssql/server
docker run -p 5000:80 --name taskboard --network taskboard --rm -d danieii/taskboard_app

docker network create react-express
docker network create express-mongo
docker build -t todo_backend .
docker build -t todo_frontend .
docker run --network react-express --name frontend -p 3000:3000 -d todo_frontend
docker run --network express-mongo --name backend -d todo_backend
docker network connect react-express backend

docker build -t vote -f vote/Dockerfile .
docker build -t result -f result/Dockerfile .
 docker build -t worker -f worker/Dockerfile .
