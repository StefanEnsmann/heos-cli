import type { Browse as BrowseCMD } from "../commands/browse.js";
import type { MusicSource } from "../constants.js";
import type {
  BrowseEntry,
  BrowseOptions,
  MusicSourceInfo,
  SearchCriteriaInfo,
} from "../payloads.js";
import type { ContainerId } from "../types.js";
import type { SuccessfulResponse, WithOptions, WithPayload } from "./base.js";

export type GetMusicSources = WithPayload<
  SuccessfulResponse<typeof BrowseCMD.GetMusicSources, "">,
  Array<MusicSourceInfo>
>;

export type GetSourceInfo = WithPayload<
  SuccessfulResponse<typeof BrowseCMD.GetSourceInfo, "">,
  Array<MusicSourceInfo>
>;

export type Browse = WithOptions<
  WithPayload<
    SuccessfulResponse<
      typeof BrowseCMD.Browse,
      | `sid=${MusicSource}&returned=${number}&count=${number}`
      | `sid=${MusicSource}&cid=${ContainerId}&range=${number},${number}&returned=${number}&count=${number}`
    >,
    Array<BrowseEntry>
  >,
  BrowseOptions
>;

export type GetSearchCriteria = WithPayload<
  SuccessfulResponse<typeof BrowseCMD.GetSearchCriteria, `sid=${MusicSource}`>,
  Array<SearchCriteriaInfo>
>;

export type Search = WithOptions<
  WithPayload<
    SuccessfulResponse<typeof BrowseCMD.Search, ``>,
    Array<BrowseEntry>
  >,
  BrowseOptions
>;

export type BrowseResponse =
  | GetMusicSources
  | GetSourceInfo
  | Browse
  | GetSearchCriteria
  | Search;
