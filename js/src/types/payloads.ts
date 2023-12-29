import type {
  Control,
  LineOut,
  MediaType,
  MusicSource,
  MusicSourceType,
  Network,
  No,
  NonStation,
  Options,
  Role,
  SearchCriteria,
  Station,
  Yes,
  YesNo,
} from "./constants.js";
import type {
  AlbumId,
  ContainerId,
  GroupId,
  MediaId,
  PlayerId,
  QueueId,
  QuickselectId,
} from "./types.js";

export type PlayerInfo = {
  name: string;
  pid: PlayerId;
  gid: GroupId | undefined;
  model: string;
  version: string;
  network: Network;
  serial: string | undefined;
} & (
  | {
      lineout: typeof LineOut.Variable;
    }
  | {
      lineout: typeof LineOut.Fixed;
      control: Control;
    }
);

export type PlayingMedia = {
  song: string;
  album: string;
  artist: string;
  image_url: string;
  mid: MediaId;
  qid: QueueId;
} & (
  | {
      type: "song";
      album_id: AlbumId;
      sid: NonStation;
    }
  | {
      type: "station";
      station: string;
      sid: Station;
    }
);

export type QueueItem = Omit<
  Extract<PlayingMedia, { type: "song" }>,
  "type" | "sid"
>;

export type PlayingStationOptions = [
  {
    play: [
      {
        id:
          | typeof Options.ThumbsUp
          | typeof Options.ThumbsDown
          | typeof Options.AddToHEOSFavorites;
        name: string;
      }
    ];
  }
];

export type BrowseOptions = [
  {
    browse: [
      | {
          id: typeof Options.CreateNewStation;
          name: string;
          scid: SearchCriteria;
        }
      | {
          id: Exclude<Options, typeof Options.CreateNewStation>;
          name: string;
        }
    ];
  }
];

export type QuickselectInfo = {
  id: QuickselectId;
  name: string;
};

export type GroupMemberInfo = {
  name: string;
  pid: PlayerId;
  role: Role;
};

export type GroupInfo = {
  name: string;
  gid: GroupId;
  players: Array<GroupMemberInfo>;
};

type MusicSourceData = {
  name: string;
  image_url: string;
  type: MusicSourceType;
  sid: MusicSource;
};

type BrowseOtherEntry = {
  playable: YesNo;
  name: string;
  image_url: string;
  mid: MediaId;
  type: Exclude<MediaType, typeof MediaType.Album | typeof MediaType.Song>;
};

type BrowseAlbumEntry = {
  playable: YesNo;
  name: string;
  image_url: string;
  mid: MediaId;
  type: typeof MediaType.Album;
  artist: string;
};

type BrowseSongEntry = {
  playable: YesNo;
  name: string;
  image_url: string;
  mid: MediaId;
  type: typeof MediaType.Song;
  artist: string;
  album: string;
};

export type BrowseEntry =
  | MusicSourceData
  | ((BrowseOtherEntry | BrowseAlbumEntry | BrowseSongEntry) &
      (
        | {
            container: typeof Yes;
            cid: ContainerId;
          }
        | {
            container: typeof No;
          }
      ));

export type MusicSourceInfo = MusicSourceData &
  (
    | {
        available: true;
        service_username: string;
      }
    | {
        available: false;
      }
  );

export type SearchCriteriaInfo =
  | {
      name: string;
      scid: SearchCriteria;
      wildcard: YesNo;
    }
  | {
      name: string;
      scid: SearchCriteria;
      wildcard: YesNo;
      playable: YesNo;
      cid: `SEARCHED_TRACKS-${string}`;
    };
