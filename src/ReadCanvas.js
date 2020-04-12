import React from 'react';
import kkk from './lol.txt'

class ReadCanvas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: ''};
    }


    wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                console.log(line);
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        console.log('wrap text');
        console.log(line);

        context.fillText(line, x, y);
    }

    componentDidMount() {
        var reader = new FileReader();

        reader.onload = function(e) {
            var text = reader.result;
        }

        fetch('http://localhost:3004')
            .then(res => {
                console.log(res);
                return res.text();
            })
            .then(res => {
                console.log(res);
                this.setState({text: res})
                console.log('set text');
                this.updateCanvas();
            });
    }
    updateCanvas() {
        this.draw()
    }

    draw() {
        console.log('draw func');

        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.font = "12px serif";
        if(this.state.text !== null){

            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');

            var maxWidth = 400;
            var lineHeight = 24;
            var x = (canvas.width - maxWidth) / 2;
            var y = 60;
            var text = this.state.text;
            context.fillStyle = '#333';
            this.wrapText(context, text, x, y, maxWidth, lineHeight);

        }
    }

    render() {
        return <canvas id={'canvas'} width={640} height={425} />;
    }
}

export default ReadCanvas;
