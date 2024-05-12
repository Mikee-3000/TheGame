import * as THREE from 'three'
import TextureMapText from '../TextureMapText.js'
import RectangularDisplay from '../Display.js';

export default class MetricsDisplay extends RectangularDisplay{
    constructor() { 
        let options = {
            height: 0.5,
            width: 1,
            text: '99999999999',
            canvasHeight: 1024,
            canvasWidth: 2048,
            fontFamily: 'Helvetica',
            textColor: 'darkblue',
            backgroundColor: 'grey',
            fontSize: 256
        }
        super(options)
    }
}