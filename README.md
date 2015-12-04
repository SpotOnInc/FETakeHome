# FETakeHome

Take home task for frontend interview candidates. Candidates: this README is,
to some extent, your instruction booklet for this task.

## Setup

Please fork this repository to your own account and optionally use a feature
branch for your work.

We recommend a Linux or OSX environment to run the API server portion of this
(which is provided for you in the form of a NodeJS application). Node 5.x is
required, which is available in [brew](http://brew.sh) on OSX, or through your
package manager of choice on Linux (Arch Linux as `nodejs`, others,
instructions available [at
NodeSource](https://github.com/nodesource/distributions).

To get started, you'll need to clone this repository, install the server-side
dependencies, and run the server:

```
cd /path/to/FETakeHome

npm install

node .
```

## The Server

The server will serve any files stored under `public`, without the `/public/`
prefix. For example, the `index.html` of this project is served at
`localhost:5000` but is at `public/index.html` on the filesystem.

The server exposes one JSON endpoint, `/register`. This endpoint is a dummy
endpoint for user registration, and while it's not necessarily
production-ready, it does the job for this task.

### POST Request `/register`

The request to `/register` accepts a JSON body with two entries: `email` and
`password`. `email` must be a valid email address. `password` must be a string
of at least 8 characters, must contain at least one uppercase and at least one
lowercase letter, and must contain at least one number and/or special
character (`!@#$%^&*()+=._-`).

### Response Example: Success

`created` is a standard Unix timestamp as produced by `Date.now()` in the Node
backend at time of creation

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 51
ETag: W/"33-LjsbSHPuMtknw+nRJg1Adg"
Date: Fri, 04 Dec 2015 21:27:48 GMT
Connection: keep-alive
```

```json
{
    "email":"josh@spoton.com",
    "created":1449264468655
}
```

### Response Example: Invalid Request

```
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 239
ETag: W/"ef-sRKYww7h4NqOpqCQqOg8/g"
Date: Fri, 04 Dec 2015 21:25:42 GMT
Connection: keep-alive
```

```json
[
   {
      "context" : {
         "value" : "joshon.com",
         "key" : "email"
      },
      "path" : "email",
      "message" : "\"email\" must be a valid email",
      "type" : "string.email"
   },
   {
      "message" : "\"password\" is required",
      "type" : "any.required",
      "path" : "password",
      "context" : {
         "key" : "password"
      }
   }
]
```

### Response Example: User is already registered

```
HTTP/1.1 409 Conflict
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-fAYxXNkcYu/Dr0YU+tkbmw"
Date: Fri, 04 Dec 2015 21:29:45 GMT
Connection: keep-alive
```

```json
{
    "message":"'josh@spoton.com' is already a registered email address"
}
```

### Responses: Other Errors

All other errors will return a JSON body similar to the above "User is already
registered" case, but will have a `500 Internal Server Error` HTTP status.

