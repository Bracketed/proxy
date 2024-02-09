# bracketed/proxy

A friendly discord webhook proxy to deploy on your server!
This is yet to be updated to support caching etc, but what we have right now is pretty good!

You can also view this on docker hub at <https://hub.docker.com/r/bracketed/proxy>!

ENV Variables:

- EXPRESS_PORT

^ Must be defined or it wont work

Example (Docker Compose):

```
version: '3.8'
name: bracketed-proxy

services:
        proxy:
                image: bracketed/proxy:latest
                container_name: bracketed-proxy
                restart: always
                ports:
                        - 3003:3003
                environment:
                        - EXPRESS_PORT=3003
```

Enjoy!
