enum RgbColors {
    //% block=red
    Red = 0x00FF00,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0xFF0000,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}

enum RgbUltrasonics {
//% block=left
Left = 0x00,
//% block=right
Right = 0x01,
//% block=all
All = 0x02
}

enum ColorEffect {
//% block=none
None = 0x00,
//% block=breathing
Breathing = 0x01,
//% block=rotate
Rotate = 0x02,
//% block=flash
Flash = 0x03
}


//% color="#FFA500" weight=10 icon="\uf2c9" block="sensors"
namespace sensors {
	
	
    /**
     * 温度传感器
     */
    
    //% blockId=sensor_temperature block="sensor_temperature pin |analogpin %pin" blockExternalInputs=false  group="温度传感器"
    //% weight=70
    export function sensor_temperature(pin: AnalogPin): number {

        let temp = (pins.analogReadPin(pin) - pins.analogReadPin(pin) / 5) / 25
        return temp
        
    }









    /**
     * 火焰传感器
     */
    
    //% blockId=sensor_flame block="sensor_flame pin |digitalpin %pin" blockExternalInputs=false  group="火焰传感器"
    //% weight=70
    export function sensor_flame(pin: DigitalPin): number {

        return pins.digitalReadPin(pin)
        
    }
    








    /**
     * 红外寻迹
     */
    
    //% blockId=sensor_infraredTracking block="sensor_infraredTracking pin |digitalpin %pin" blockExternalInputs=false  group="红外寻迹传感器"
    //% weight=70
    export function sensor_infraredTracking(pin: DigitalPin): number {

        return pins.digitalReadPin(pin)
        
    }
    








    /**
     * 倾斜传感器
     */
    
    //% blockId=sensor_incline block="sensor_incline pin |digitalpin %pin" blockExternalInputs=false  group="倾斜传感器"
    //% weight=70
    export function sensor_incline(pin: DigitalPin): number {

        return pins.digitalReadPin(pin)
        
    }





    

    /**
     * 光敏传感器
     */
    
    //% blockId=sensor_illumination block="sensor_illumination pin |analogpin %pin" blockExternalInputs=false  group="光敏传感器"
    //% weight=70
    export function sensor_illumination(pin: AnalogPin): number {

        return pins.analogReadPin(pin)
        
    }
    




    

    /**
     * 热敏传感器
     */
    
    //% blockId=sensor_thermosensitive block="sensor_thermosensitive pin |analogpin %pin" blockExternalInputs=false  group="热敏传感器"
    //% weight=70
    export function sensor_thermosensitive (pin: AnalogPin): number {

        return pins.analogReadPin(pin)
        
    }
	    




    

    /**
     * 水位传感器
     */
    
    //% blockId=sensor_waterLevel block="sensor_waterLevel pin |analogpin %pin" blockExternalInputs=false  group="水位传感器"
    //% weight=70
    export function sensor_waterLevel(pin: AnalogPin): number {

        return pins.analogReadPin(pin)
        
    }
    	    




    

    /**
     * 土壤湿度传感器
     */
    
    //% blockId=sensor_soilMoisture block="sensor_soilMoisture pin |analogpin %pin" blockExternalInputs=false  group="土壤湿度传感器"
    //% weight=70
    export function sensor_soilMoisture(pin: AnalogPin): number {

        return pins.analogReadPin(pin)
        
    }
	
	
	
	
	
	
	
	/**
	 *  RGB超声波
	 */
	
	const LED0_ON_L = 0x06
	const LED0_ON_H = 0x07
	const LED0_OFF_L = 0x08
	const LED0_OFF_H = 0x09
	const ALL_LED_ON_L = 0xFA
	const ALL_LED_ON_H = 0xFB
	const ALL_LED_OFF_L = 0xFC
	const ALL_LED_OFF_H = 0xFD
	
	export enum SonarVersion {
	V1 = 0x1,
	V2 = 0x2
	}
	
	let initialized = false
	let neoStrip: neopixel.Strip;
	let matBuf = pins.createBuffer(17);
	let distanceBuf = 0;
	
	
	/**
	 * Get RUS04 distance
	 * @param pin Microbit ultrasonic pin; eg: P2
	*/
	//% blockId=motorbit_ultrasonic block="Read RgbUltrasonic Distance|pin %pin|cm"  group="RGB超声波"
	//% weight=76
	export function Ultrasonic(pin: DigitalPin): number {
		return UltrasonicVer(pin, SonarVersion.V1);
	}

	function UltrasonicVer(pin: DigitalPin, v: SonarVersion): number {

		// send pulse
		if (v == SonarVersion.V1) {
			pins.setPull(pin, PinPullMode.PullNone);
		}
		else { pins.setPull(pin, PinPullMode.PullDown); }
		pins.digitalWritePin(pin, 0);
		control.waitMicros(2);
		pins.digitalWritePin(pin, 1);
		control.waitMicros(50);
		pins.digitalWritePin(pin, 0);

		// read pulse
		let d = pins.pulseIn(pin, PulseValue.High, 25000);
		let ret = d;
		// filter timeout spikes
		if (ret == 0 && distanceBuf != 0) {
			ret = distanceBuf;
		}
		distanceBuf = d;
		if (v == SonarVersion.V1) {
			return Math.floor(ret * 9 / 6 / 58);
		}
		return Math.floor(ret / 40 + (ret / 800));
		// Correction
	}

	function RgbDisplay(indexstart: number, indexend: number, rgb: RgbColors): void {
		for (let i = indexstart; i <= indexend; i++) {
			neoStrip.setPixelColor(i, rgb);
		}
		neoStrip.show();
	}

	//% blockId="motorbit_rus04" block="part %index|show color %rgb|effect %effect|rgbpin %pin"  group="RGB超声波"
	//% weight=75
	export function RUS_04(index: RgbUltrasonics, rgb: RgbColors, effect: ColorEffect,pin:DigitalPin): void {
		let start, end;
		if (!neoStrip) {
			neoStrip = neopixel.create(pin, 6, NeoPixelMode.RGB)
		}
		if (index == RgbUltrasonics.Left) {
			start = 0;
			end = 2;
		} else if (index == RgbUltrasonics.Right) {
			start = 3;
			end = 5;
		} else if (index == RgbUltrasonics.All) {
			start = 0;
			end = 5;
		}
		switch(effect) {
			case ColorEffect.None:
				RgbDisplay(start, end, rgb);
				break;
			case ColorEffect.Breathing:
			for (let i = 0; i < 255; i+=2) {
				neoStrip.setBrightness(i);
				RgbDisplay(start, end, rgb);
				//basic.pause((255 - i)/2);
				basic.pause((i < 20)? 80 :(255/i));
			}
			for (let i = 255; i > 0; i-=2) {
				neoStrip.setBrightness(i);
				RgbDisplay(start, end, rgb);
				basic.pause((i < 20)? 80 :(255/i));
			}
			break;
			case ColorEffect.Rotate:
				for (let i = 0; i < 4; i++) {
					neoStrip.setPixelColor(start, rgb);
					neoStrip.setPixelColor(start+1, 0);
					neoStrip.setPixelColor(start+2, 0);
					if (index == RgbUltrasonics.All) {
						neoStrip.setPixelColor(end-2, rgb);
						neoStrip.setPixelColor(end-1, 0);
						neoStrip.setPixelColor(end, 0);
					}
					neoStrip.show();
					basic.pause(150);
					neoStrip.setPixelColor(start, 0);
					neoStrip.setPixelColor(start+1, rgb);
					neoStrip.setPixelColor(start+2, 0);
					if (index == RgbUltrasonics.All) {
						neoStrip.setPixelColor(end-2, 0);
						neoStrip.setPixelColor(end-1, rgb);
						neoStrip.setPixelColor(end, 0);
					}
					neoStrip.show();
					basic.pause(150);
					neoStrip.setPixelColor(start, 0);
					neoStrip.setPixelColor(start+1, 0);
					neoStrip.setPixelColor(start+2, rgb);
					if (index == RgbUltrasonics.All) {
						neoStrip.setPixelColor(end-2, 0);
						neoStrip.setPixelColor(end-1, 0);
						neoStrip.setPixelColor(end, rgb);
					}
					neoStrip.show();
					basic.pause(150);
				}
				RgbDisplay(4, 9, 0);
				break;
			case ColorEffect.Flash:
			for (let i = 0; i < 6; i++) {
				RgbDisplay(start, end, rgb);
				basic.pause(150);
				RgbDisplay(start, end, 0);
				basic.pause(150);
			}
			break;
		}
	}




}