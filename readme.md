# Auth Server

Authentication server.

## Quick Start

1. Start mongo and redis.

	```
	docker-compose up
	```

2. Install dependencies.

	```
	yarn
	```
	
3. Start server.

	```
	yarn start
	```

## API

#### POST `/v1/register`

Registers a user given email and password.

#### POST `/v1/authenticate`

Authenticates a user given email and password, returns a jwt.

#### POST `/v1/verify`

Verifies a jwt.