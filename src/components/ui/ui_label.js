'use srict';

export default class UILabel {
    constructor(text, parent) {
        let node = document.createElement('div');
        
        let textWithSpace = '';
        for(let i = 0; i < text.length - 1; i++) {
            textWithSpace += text[i] + ' ';
        }
        textWithSpace += text[text.length - 1];

        [...textWithSpace].forEach( char => {
            node.append( this.getCharNode(char) );
        });

        node.classList.add('center_position');
        this.node = node;
        parent.append(this.node);
    }

    getCharNode(char) {
        let result = document.createElement('div');
        result.style.height = '16px';
        switch(char) {
            case 'а':
                result.style.width = '12px';
                result.style.backgroundImage = './chars/ru/a.png';
                break;
            case 'г':
                result.style.width = '10px';
                result.style.backgroundImage = './chars/ru/g.png';
                break;
            case 'и':
                result.style.width = '14px';
                result.style.backgroundImage = './chars/ru/i.png';
                break;
            case 'р':
                result.style.width = '12px';
                result.style.backgroundImage = './chars/ru/r.png';
                break;
            case ' ':
                result.style.width = '4px';
                break;

        }
        return result;
    }
}