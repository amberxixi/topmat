FROM python:3.9.0
RUN mkdir app
WORKDIR /app
COPY . /app/
RUN pip install gunicorn gevent -i https://pypi.doubanio.com/simple/ --trusted-host pypi.doubanio.com
RUN pip install -r requirements.txt -i https://pypi.doubanio.com/simple/ --trusted-host pypi.doubanio.com
ENV MONGO_HOST=topmat_mongo 
ENV MONGO_PORT=27017


EXPOSE 8081

CMD ["gunicorn", "main:app", "-c", "./gun.py"]

