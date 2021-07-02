import { Engine } from './engine.js'

export class Control {
	speed

	constructor(speed) {
		this.speed = speed
		this.engineLeft = new Engine(21, 20, 1)
		this.engineRight = new Engine(13, 19, 1)
	}

	forward() {
		this.engineRight.forward(this.speed)
		this.engineLeft.forward(this.speed)
		console.log('forward')
	}

	right() {
		this.engineRight.backward(this.speed)
		this.engineLeft.forward(this.speed)
		console.log('right')
	}

	left() {
		this.engineRight.forward(this.speed)
		this.engineLeft.backward(this.speed)
		console.log('left')
	}

	reverse() {
		this.engineRight.backward(this.speed)
		this.engineLeft.backward(this.speed)
		console.log('reverse')
	}

	stop() {
		this.engineRight.stop()
		this.engineLeft.stop()
		console.log('stop')
	}
}
