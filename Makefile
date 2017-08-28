DOCKER_ROOT 			:= esayemm
APP_NAME          := auth-server
DOCKER_REPO       := $(DOCKER_ROOT)/$(APP_NAME)
VERSION           ?= $(shell git rev-parse --short HEAD)
export

.PHONY: test.build docker.push

test.build:
	docker-compose -f docker-compose.test.yml -p auth-server-test build
	docker-compose -f docker-compose.test.yml -p auth-server-test up -d
	docker-compose -f docker-compose.test.yml -p auth-server-test logs -f app_test
	docker-compose -f docker-compose.test.yml -p auth-server-test stop
	@CONT_EXIT_STATUS=`docker inspect --format='{{.State.ExitCode}}' auth-server-test`; \
	if [ $$CONT_EXIT_STATUS -ne 0 ]; then \
		exit 1; \
	fi
	docker-compose -f docker-compose.test.yml -p auth-server-test rm -f

docker.push:
	docker build -t $(SERVICE_NAME) .
	docker tag -f $(SERVICE_NAME) $(DOCKER_REPO):$(VERSION)
	docker push $(DOCKER_REPO)
