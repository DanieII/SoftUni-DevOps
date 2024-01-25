network create wp_network
docker run -dit --name wordpress_db -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=wordpressdb -e MYSQL_USER=wordpress -e MYSQL_PASSWORD=wordpress --expose 3306 --expose 33060 --network wp_network -v ${pwd}/data:/var/lib/mysql mysql
docker run -d --name wordpress-website -e WORDPRESS_DB_HOST=wordpress_db -e WORDPRESS_DB_USER=wordpress -e WORDPRESS_DB_PASSWORD=wordpress -e WORDPRESS_DB_NAME=wordpressdb -v ${pwd}/wp-data:/var/www/html -p 80:80 --network wp_network wordpress
