import { Server as SocketServer } from 'socket.io'

export class Socket {
	socketServer
	port

	constructor(port) {
		this.port = port
		this.socketServer = new SocketServer({
			cors: {
				origin: '*',
			},
		})
	}

	start() {
		this.socketServer.listen(5000)

		this.socketServer.on('connection', (client) => {
			client.on('mcuData', (data) => {
				this.mcu.setMode(data.mode)
				if (data.mode === McuMode.square) {
					fakeGpsController.startSendingFakeData()
				}
			})
		})
	}

	emitPositionData(positionData) {
		this.socketServer.emit('gpsData', positionData)
	}

	emitMagnetometerData(magnetometerData) {
		this.socketServer.emit('magnetometerData', magnetometerData)
	}

	emitEngineData(engineData) {
		this.socketServer.emit('engineData', engineData)
	}

	emitMcuData(mcuData) {
		this.socketServer.emit('mcuData', mcuData)
	}
}
