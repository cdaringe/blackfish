# blackfish

docker-compose cli extensions

## install

`npm install -g blackfish`

## usage

blackfish installs with two executables, `blackfish`, or `bf` for short.

run blackfish to glob up your compose files and run a subset of compose services.

blackfish will create a new compose file based on your selection, and proxy the rest of your command off to `docker-compose`.

<img width="400px" src="https://github.com/cdaringe/blackfish/blob/master/img/blackfish.demo.mov.gif?raw=true" />

```sh
$ bf --help

  docker* cli extensions

  Usage
    $ bf

  Options
    --compose, -c docker-compose
    --interactive, -i  interactive docker-compose
    --files, -f compose files

  Examples
    $ bf -ci -- up
    $ bf -ci -f docker-compose.yml,docker-compose.dev.yml -- up
```

## warning

- alpha software! ;)
