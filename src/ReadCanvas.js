import React from 'react';

class ReadCanvas extends React.Component {


    async downloadFile(){
        let blob = await fetch('/public/files/test.txt').then(r => r.blob());
        return blob;
    }

    componentDidMount() {
        var reader = new FileReader();

        reader.onload = function(e) {
            var text = reader.result;
        }

        var blob = this.downloadFile();
        console.log(blob);

        reader.readAsText(blob);

        this.updateCanvas();
    }
    updateCanvas() {
        this.draw()
    }

    draw() {
        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.font = "48px serif";
        ctx.fillText("Hello world", 10, 50);
    }

    render() {
        return <canvas id={'canvas'} width={640} height={425} />;
    }
}

export default ReadCanvas;
