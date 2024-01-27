docker run -d --name ls-server -p 80:8080 lightstreamer

docker run -d --name ghost-container -p 3001:2368 -e NODE_ENV=development ghost

docker run -d --name my-apache-app -p 8080:80 -v ${pwd}/:/usr/local/apache2/htdocs/ httpd

docker run -d -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=yourStrongPassword12# -p 1433:1433 -v sqldata:/var/opt/mssql mcr.microsoft.com/mssql/server

docker network create mariadb
docker run -d --name some-mariadb --network mariadb -e MARIADB_ROOT_PASSWORD=my-secret-pw mariadb
docker run -it --network mariadb --rm mariadb mariadb -hsome-mariadb -uroot -p
