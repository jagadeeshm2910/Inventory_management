FROM postgres:14

ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydb

EXPOSE 5432

COPY init.sql /docker-entrypoint-initdb.d/

CMD ["postgres"]


# CREATE DATABASE mydb;
# CREATE USER myuser WITH PASSWORD 'mypassword';
# GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;