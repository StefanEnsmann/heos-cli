export const Browse = {
  GetMusicSources: "browse/get_music_sources",
  GetSourceInfo: "browse/get_source_info",
  Browse: "browse/browse",
  GetSearchCriteria: "browse/get_search_criteria",
  Search: "browse/search",
  PlayStream: "browse/play_stream",
  PlayPreset: "browse/play_preset",
  PlayInput: "browse/play_input",
  AddToQueue: "browse/add_to_queue",
  RenamePlaylist: "browse/rename_playlist",
  DeletePlaylist: "browse/delete_playlist",
  RetrieveMetadata: "browse/retrieve_metadata",
  GetServiceOptions: "browse/get_service_options",
  SetServiceOption: "browse/set_service_option",
} as const;

export type Browse = (typeof Browse)[keyof typeof Browse];
