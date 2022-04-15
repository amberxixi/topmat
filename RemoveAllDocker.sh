docker network disconnect topmat_mongo
docker network disconnect topmat_web
docker network disconnect topmat_server
docker network rm Topmat_network
docker stop topmat_mongo
docker stop topmat_web
docker stop topmat_server
docker rm topmat_mongo
docker rm topmat_web
docker rm topmat_server
docker rmi topmat:web
docker rmi topmat:server
