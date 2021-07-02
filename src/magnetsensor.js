import HMC5883L from 'compass-hmc5883l'

export class Magnetometer {
	compass
	currentValue
	intervalTime
	interval

	constructor(busNumber, intervalTime) {
		this.compass = new HMC5883L(busNumber)
		this.currentValue = null
		this.interval = null
		this.intervalTime = intervalTime
	}

	read() {
		this.compass.getRawValues((err, vals) => (this.currentValue = vals))
	}

	start() {
		if (this.interval) {
			throw Error('Magnetometer interval already running')
		}

		this.interval = setInterval(() => this.read(), this.intervalTime)
	}

	stop() {
		if (this.interval !== null) {
			clearInterval(this.interval)
			this.interval = null
		}
	}
}
