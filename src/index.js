import { Control } from './control.js'
import { Magnetometer } from './magnetsensor.js'
import { Server } from 'socket.io'

const magnetometer = new Magnetometer(1, 100)
magnetometer.start()

const control = new Control(140)

let y = 0
const checkRate = 200

const socket = new Server({
	cors: {
		origin: '*',
	},
})
socket.listen(5000)

socket.on('connection', (client) => {
	client.on('mode', (mode) => {
		switch (mode) {
			case 'stop':
				clearTimeout(interval)
				control.stop()
				break
			case 'forward':
				control.forward()
				break
			case 'search':
				clearTimeout(interval)
				search()
		}
	})
})

setInterval(() => {
	if (magnetometer.currentValue) {
		y = Object.values(magnetometer.currentValue)[1]
		socket.emit('magnetometerData', magnetometer.currentValue)
		console.log(y)
	}
	if (y !== 0) {
		socket.emit('mine', 'Yes')
		clearTimeout(interval)
		control.stop()
	}
}, checkRate)

// SERACHING AN AREA
let i = 0
let interval = null

function search() {
	i = 0
	nextStep()
}

function nextStep() {
	const driving = [
		{ time: 2000, fn: control.forward },
		{ time: 1600, fn: control.right },
		{ time: 1000, fn: control.forward },
		{ time: 1600, fn: control.right },
		{ time: 2000, fn: control.forward },
		{ time: 1600, fn: control.left },
		{ time: 1000, fn: control.forward },
		{ time: 1600, fn: control.left },
	]
	driving[i].fn.call(control)
	interval = setTimeout(() => {
		i++
		if (i >= 8) i = 0
		nextStep()
	}, driving[i].time)
}

// handle program exit
export const exitHandler = (options, exitCode) => {
	control.stop()
	if (options.cleanup) console.log('clean')
	if (exitCode || exitCode === 0) console.log(exitCode)
	if (options.exit) process.exit()
}

// exit event
process.on('exit', exitHandler.bind(null, { cleanup: true }))

// ctrl+c
process.on('SIGINT', exitHandler.bind(null, { exit: true }))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

// uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
