# Multiplayer Motion Capture Server

Node.js backend server for a real-time multiplayer motion capture game.

This server handles:

* Player connections
* Multiplayer rooms
* Motion data broadcasting
* Server health checks
* Room creation and management

The frontend captures motion using MediaPipe and sends landmark data through WebSockets. The server relays this data to other players in the same room.

---

# Architecture

```
Mobile Browser
      |
      |
MediaPipe Pose + Hands
      |
      |
WebSocket (WSS)
      |
      |
Node.js Server
      |
      |
Other Players / Avatar Viewer
```

---

# Requirements

* Node.js 18+
* npm

---

# Install

Install dependencies:

```bash
npm install
```

Dependencies:

* express
* cors
* ws

---

# Run Server

Development:

```bash
npm start
```

Server starts:

```
HTTP Server: 8080
WebSocket Server: 8080
```

---

# Environment

Default:

```
PORT=8080
```

For Render deployment:

The server uses:

```
process.env.PORT
```

so Render can assign the correct port.

---

# HTTP API

## Server Status

Checks if the server is online.

### Request

```
GET /api/status
```

### Response

```json
{
  "online": true,
  "service": "motion-game-server",
  "time": 1720000000
}
```

---

# Rooms API

## Create Room

Creates a new multiplayer room.

### Request

```
POST /api/rooms/create
```

### Response

```json
{
  "roomId": "AB12CD"
}
```

The client stores this room ID and uses it when joining through WebSocket.

---

## List Rooms

Returns available rooms.

### Request

```
GET /api/rooms
```

### Response

```json
[
  "AB12CD",
  "GAME01"
]
```

---

# WebSocket Connection

The client connects using:

Development:

```
ws://localhost:8080
```

Production:

```
wss://your-domain.com
```

---

# WebSocket Messages

## Join Room

Sent after connecting.

```json
{
  "type": "join",
  "roomId": "AB12CD",
  "playerId": "player123"
}
```

The server assigns the player to that room.

---

## Joined Response

Server replies:

```json
{
  "type": "joined",
  "roomId": "AB12CD",
  "playerId": "player123"
}
```

---

# Motion Packet

Motion capture clients send:

```json
{
  "type": "motion",
  "roomId": "AB12CD",
  "playerId": "player123",
  "timestamp": 1720000000,
  "pose": [],
  "hands": [],
  "handedness": []
}
```

---

# Pose Data

Pose contains MediaPipe body landmarks.

Example:

```json
[
  {
    "x":0.5,
    "y":0.4,
    "z":-0.2
  }
]
```

MediaPipe Pose provides:

```
33 body landmarks
```

---

# Hand Data

Hands contain MediaPipe hand landmarks.

Each hand contains:

```
21 landmarks
```

Example:

```json
[
 [
  {
   "x":0.4,
   "y":0.3,
   "z":-0.1
  }
 ]
]
```

---

# Broadcasting

Motion messages are only sent to players inside the same room.

Example:

```
Room A

Player 1
   |
   |
 Server
   |
   |
Player 2


Room B

Player 3
   |
   |
 Server
   |
   |
Player 4
```

Players in different rooms never receive each other's motion data.

---

# Player Flow

```
Open Game

      |

Check API Status

      |

Login

      |

Create / Join Room

      |

Connect WebSocket

      |

Send Motion Data

      |

Update Avatar
```

---

# Future Features

Planned:

* Player accounts
* Persistent rooms
* Matchmaking
* Spectator mode
* Avatar synchronization
* Bone rotation solver
* Dance scoring
* Replay recording
* Motion compression

---

# Deployment

Recommended setup:

```
Frontend
Next.js + MediaPipe
        |
        |
      Vercel


Backend
Node.js + WebSocket
        |
        |
      Render
```

Production WebSocket URL:

```
wss://your-render-domain.com
```

Production API:

```
https://your-render-domain.com/api/status
```
