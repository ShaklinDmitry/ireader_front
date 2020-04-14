import React from 'react';
import PDFJS from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;


class ReadCanvas extends React.Component {

    constructor(props) { 
        super(props);
        this.state = {text: '',
                      pdf: new Object(),
                      swipedir: '',
                      curPage:0};

        var startX,
            startY,
            dist,
            distX,
            distY,
            threshold = 150, //required min distance traveled to be considered swipe
            restraint = 100, // maximum distance allowed at the same time in perpendicular direction
            allowedTime = 300, // maximum time allowed to travel that distance
            elapsedTime,
            startTime;

        document.addEventListener('touchstart', (e) => {
            this.swipedir = 'none'
            dist = 0
            startX = e.touches[0].clientX
            startY = e.touches[0].clientY
            startTime = new Date().getTime() // record time when finger first makes contact with surface
        });

        document.addEventListener('touchend', (e) => {
            var touchobj = e.changedTouches[0]

            if(touchobj == undefined){
                return
            }

            distX = touchobj.clientX - startX // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.clientY - startY // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime // get time elapsed
            if (elapsedTime <= allowedTime){ // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                    this.swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                }
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                    this.swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                }
                console.log(this.swipedir);
            }

            switch (this.swipedir) {
                case 'left':
                    this.curPage--;
                    break;
                case 'right':
                    this.curPage++;;
                    break;

                default:
            }

            console.log(this.curPage);

        }, false)

    }


    componentDidMount() {
        var reader = new FileReader();

        reader.onload = function(e) {
            var text = reader.result;
        }

        PDFJS.getDocument('http://localhost:3004').then(
            (pdfFile)=>{
                this.setState({pdf:pdfFile});
            }
        );

    }

    openPage(number){
        this.state.pdf.getPage(number).then(function(page) {
            var scale = 1;
            var viewport = page.getViewport({ scale: scale, });

            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext);
            // you can now use *page* here
        });
    }

    render() {
        return <canvas id={'canvas'} width={640} height={425}/>;
    }
}

export default ReadCanvas;
