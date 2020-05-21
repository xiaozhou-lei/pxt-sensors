


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
     * 光敏传感器
     */
    
    //% blockId=sensor_illumination block="sensor_illumination pin |analogpin %pin" blockExternalInputs=false  group="光敏传感器"
    //% weight=70
    export function sensor_illumination(pin: AnalogPin): number {

        return pins.analogReadPin(pin)
        
    }




}