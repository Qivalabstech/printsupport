import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || ''

let _socket: Socket | null = null

export function getSocket(token?: string): Socket {
  if (!_socket) {
    _socket = io(SOCKET_URL, {
      auth: token ? { token } : {},
      autoConnect: true,
      withCredentials: true,
      transports: ['websocket', 'polling']
    })
  }
  return _socket
}

export function disconnectSocket() {
  if (_socket) {
    _socket.disconnect()
    _socket = null
  }
}

export function reconnectSocket(token?: string) {
  disconnectSocket()
  return getSocket(token)
}
