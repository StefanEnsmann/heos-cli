import type { Browse as BrowseCMD } from "../commands/browse.js";
import type { MusicSource } from "../constants.js";
import type {
  BrowseEntry,
  BrowseOptions,
  MusicSourceInfo,
  SearchCriteriaInfo,
} from "../payloads.js";
import type { ContainerId } from "../types.js";
import type {
  FailableResponseWithPayload,
  FailableResponseWithPayloadAndOptions,
} from "./base.js";

export type GetMusicSources = FailableResponseWithPayload<
  typeof BrowseCMD.GetMusicSources,
  "",
  Array<MusicSourceInfo>
>;
export type GetSourceInfo = FailableResponseWithPayload<
  typeof BrowseCMD.GetSourceInfo,
  "",
  Array<MusicSourceInfo>
>;
export type Browse = FailableResponseWithPayloadAndOptions<
  typeof BrowseCMD.Browse,
  | `sid=${MusicSource}&returned=${number}&count=${number}`
  | `sid=${MusicSource}&cid=${ContainerId}&range=${number},${number}&returned=${number}&count=${number}`,
  Array<BrowseEntry>,
  BrowseOptions
>;
export type GetSearchCriteria = FailableResponseWithPayload<
  typeof BrowseCMD.GetSearchCriteria,
  `sid=${MusicSource}`,
  Array<SearchCriteriaInfo>
>;
export type Search = FailableResponseWithPayloadAndOptions<
  typeof BrowseCMD.Search,
  ``,
  Array<BrowseEntry>,
  BrowseOptions
>;
