# HEOS CLI library for JavaScript

A JavaScript implementation of the HEOS CLI protocol v1.17. It has no dependencies and is built with full TypeScript support.

For the official documentation, see the [Denon homepage](https://support.denon.com/app/answers/detail/a_id/6953). A full documentation of this package is available [here](https://heos-web.github.io/cli-js).

## Installation

Using NPM:
```bash
npm install heos-web/cli
```

Using yarn:
```bash
yarn add heos-web/cli
```

## Usage

All interactions with the HEOS system are implemented as promises / async functions. Parallel operations are not supported and will raise an error.

### Connecting to HEOS devices

```javascript
import { Connection } from "@HEOS-Web/cli";

const connection = await Connection.discoverAndConnect();
```

Connecting to the HEOS system consists of two steps: Discovering HEOS devices and establishing a connection to one of them.

The most convenient way is the static function `discoverAndConnect()` from the `Connection` class. It will look for available devices and connect to the first device it finds.

You can also establish a connection manually by awaiting the global function `discoverDevices(...)`, which will return an array of `RoutingInfo` and then calling `Connection.toDevice(routingInfo)`.

When a connection is established, a socket connection is automatically created for sending commands, as well as a separate connection for receiving events (see [Receiving Events](#receiving-events)).

### Sending commands

Sending commands is done via exposed async functions on the `Connection` object. Depending on the command it will either resolve with an appropriate object or class instance, or with `void`.

```javascript
const players = await connection.getPlayers();

players.forEach((player) => {
  console.log(player.pid);
});
```

### Receiving events

The `Connection` instance acts as an event emitter for supported events. Receiving events from the HEOS system requries a `receiveEvents()` call to instruct the system to send unsolicited events to the client.

This package takes care of establishing a second TCP connection to the HEOS system for receiving events. For further information about connection management, consult the [protocol documentation](https://support.denon.com/app/answers/detail/a_id/6953).

```javascript
import { Connection } from "@HEOS-Web/cli";
import { Event } from "@HEOS-Web/cli/util";

const connection = await Connection.discoverAndConnect();

connection
  .on(Event.PlayerStateChanged, (pid, state) => {
    console.log("Play state changed:", pid, state);
  })
  .on(Event.PlayerNowPlayingProgress, (pid, cur_pos, duration) => {
    console.log("Progress:", pid, cur_pos, duration);
  });

await connection.receiveEvents();
```