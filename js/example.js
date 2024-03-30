import { Connection } from "./dist/index.js";
import { Event } from "./dist/util/index.js";

const connection = await Connection.discoverAndConnect();
connection.on(Event.PlayerStateChanged, (pid, state) => {
  console.log("Play state changed:", pid, state);
}).on(Event.PlayerNowPlayingProgress, (pid, cur_pos, duration) => {
  console.log("Progress:", pid, cur_pos, duration);
});
connection.receiveEvents().then(() => {
  setTimeout(() => {
    connection.receiveEvents(false).then(() => {
      connection.close();
    });
  }, 20000);
}).catch(() => {
  connection.close();
});

