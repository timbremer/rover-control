import { Gpio } from 'pigpio'

export class Engine {
	pinForward
	pinBackward
	instanceForward
	instanceBackward
	status

	constructor(forwardPin, backwardPin) {
		this.pinForward = forwardPin
		this.pinBackward = backwardPin
		this.instanceForward = new Gpio(this.pinForward, { mode: Gpio.OUTPUT })
		this.instanceBackward = new Gpio(this.pinBackward, { mode: Gpio.OUTPUT })
		this.stop()
		this.status = {
			direction: 'standing',
			pwmValue: 0,
		}
	}

	stop() {
		this.instanceForward.digitalWrite(0)
		this.instanceBackward.digitalWrite(0)
		this.status = {
			direction: 'standing',
			pwmValue: 0,
		}
	}

	forward(pwm) {
		this.stop()
		this.instanceForward.pwmWrite(pwm)
		this.status = {
			direction: 'forward',
			pwmValue: pwm,
		}
	}

	backward(pwm) {
		this.stop()
		this.instanceBackward.pwmWrite(pwm)
		this.status = {
			direction: 'backward',
			pwmValue: pwm,
		}
	}
}
