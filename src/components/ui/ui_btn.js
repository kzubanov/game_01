'use strict';

import UIAnimatedComponent from './ui_animated_component.js';
import CONSTANTS from './../../utils/constants.js';
import UILabel from './ui_label.js';

export default class UIButton extends UIAnimatedComponent {

    constructor(options) {
        super( Object.assign(options, {
            width: CONSTANTS.BLOCK_WIDTH * 8,
            height: CONSTANTS.BLOCK_HEIGHT * 1,
        }));
        

    }
}