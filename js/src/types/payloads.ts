import { Control, LineOut, Network } from "./constants"

export type PlayerInformation = {
  name: string
  pid: string
  gid: string | undefined
  model: string
  version: string
  network: Network
  serial: string | undefined
} & ({
  lineout: LineOut.Variable
} | {
  lineout: LineOut.Fixed
  control: Control
})
