.PHONY: test.build

test.build:
	docker-compose -f docker-compose.test.yml -p auth-server-test up
