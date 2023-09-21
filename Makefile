DB_NAME = movie_theater
NETWORK_NAME = theater-network
CONTAINER_NAME = theater-db
SCHEMA_PATH = src/db/migration
DB_SOURCE = "postgresql://root:secret@localhost:5432/$(DB_NAME)?sslmode=disable"

network:
	docker network inspect $(NETWORK_NAME) >/dev/null 2>&1 || \
        docker network create --driver bridge $(NETWORK_NAME)

postgres:
	docker run -d --name $(CONTAINER_NAME) --network $(NETWORK_NAME) -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret postgres:14-alpine

run-db:
	docker start $(CONTAINER_NAME)

create-db:
	docker exec -it $(CONTAINER_NAME) createdb --username=root --owner=root $(DB_NAME)

drop-db:
	docker exec -it $(CONTAINER_NAME) dropdb $(DB_NAME)

migrate-up:
	migrate -path $(SCHEMA_PATH) -database $(DB_SOURCE) -verbose up

migrate-up-1:
	migrate -path $(SCHEMA_PATH) -database $(DB_SOURCE) -verbose up 1

migrate-down:
	migrate -path $(SCHEMA_PATH) -database $(DB_SOURCE) -verbose down

migrate-down-1:
	migrate -path $(SCHEMA_PATH) -database $(DB_SOURCE) -verbose down 1

migrate-create:
	migrate create -ext sql -dir $(SCHEMA_PATH) -seq $(name)

server:
	mvn clean spring-boot:run



.PHONY: postgres create-db drop-db migrate-up migrate-up-1 migrate-down migrate-down-1  server  run-db