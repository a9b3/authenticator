.PHONY: test.build

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
