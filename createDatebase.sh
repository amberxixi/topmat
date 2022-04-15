docker pull mongo
docker run -d --name topmat_mongo mongo:latest

#手动完成以下命令：
#docker cp dump topmat_mongo:/dump
#docker exec -it topmat_mongo bash
#mongorestore 