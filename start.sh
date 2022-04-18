docker network create Topmat_network
docker network connect Topmat_network topmat_mongo 
cd server
docker build -t topmat:server .
docker run -d --name topmat_server --net Topmat_network topmat:server
echo "server start"
cd ..
cd web
npm config set registry http://registry.npm.taobao.org
npm install
npm run build
docker build -t topmat:web .
docker run -d --name topmat_web --net Topmat_network -p 8082:80 topmat:web
echo "web start"
cd ..
