# HEOS CLI

# Protocol Documentation (1.17)

For the official documentation, see the official Denon [homepage](https://support.denon.com/app/answers/detail/a_id/6953).

## Connecting

HEOS uses the SSDP protocol via UDP. To discover devices in the local network, send a `M-SEARCH` message and listen to responses (trailing newline is required):

```http
M-SEARCH * HTTP/1.1
HOST: 239.255.255.250:1900
ST: urn:schemas-denon-com:device:ACT-Denon:1
MX: 5
MAN: "ssdp:discover"

```

After discovering at least one device, one can connect to the HEOS CLI via a TCP connection to the reported IP address on port 1255.

## Responses and Events

A data object from the HEOS system is transmitted in JSON format and consists at least of the following:

```json
{
  "heos": {
    "command": "<group>/<command or event>",
    "message": "<message>"
  }
}
```

Responses to commands also contain a `result` field and can optionally include a `payload` and/or `options` field:

```json
{
  "heos": {
    "command": "<group>/<command>",
    "result": "success|fail",
    "message": "<message>"
  },
  "payload": {},
  "options": []
}
```

Long running commands can potentially send a message that signals the processing of the request:

```json
{
  "heos": {
    "command": "<group>/<command>",
    "result": "success",
    "message": "command under process"
  }
}
```

## Commands

Some query parameters supported by a command accept one of a predefined set of values. For a list of those values, see [Constants](#constants). Command responses usually return the query string as their `message` field.

### System Commands

#### Register for Change Events

Command: `heos://system/register_for_change_events`

| Attribute | Description                              | Value           | Required |
| --------- | ---------------------------------------- | --------------- | -------- |
| enable    | Register or unregister for change events | [OnOff](#onoff) | Yes      |

Response:

```json
{
  "heos": {
    "command": "system/register_for_change_events",
    "result": "success",
    "message": "enable=<OnOff>"
  }
}
```

#### Check HEOS Account

Command: `heos://system/check_account`

This command is can return a message parameter without a corresponding value to signal no signed in user, see [LoginState](#loginstate).

Response:

```json
{
  "heos": {
    "command": "system/check_account",
    "result": "success",
    "message": "<LoginState>"
  }
}
```

#### Sign In

Command: `heos://system/sign_in`

| Attribute | Description                   | Value  | Required |
| --------- | ----------------------------- | ------ | -------- |
| un        | The username to use for login | string | Yes      |
| pw        | The password to use for login | string | Yes      |

Response:

```json
{
  "heos": {
    "command": "system/sign_in",
    "result": "success",
    "message": "<LoginState.signed_in>"
  }
}
```

#### Sign Out

Command: `heos://system/sign_out`

This command is can return a message parameter without a corresponding value to signal no signed in user, see [LoginState](#loginstate).

Response:

```json
{
  "heos": {
    "command": "system/sign_out",
    "result": "success",
    "message": "<LoginState.signed_out>"
  }
}
```

## Constants

### OnOff

| Value | Description                     |
| ----- | ------------------------------- |
| on    | Sets the given setting to "on"  |
| off   | Sets the given setting to "off" |

### LoginState

| Value                    | Description                                                                  |
| ------------------------ | ---------------------------------------------------------------------------- |
| signed_out               | Currently no user is logged in to the HEOS system                            |
| signed_in&un=\<username> | The user identified by \<username> is currently logged in to the HEOS system |
