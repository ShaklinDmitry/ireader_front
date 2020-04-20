import React from 'react';
import PDFJS from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

class ReadCanvas extends React.Component {

    constructor(props) {

        super(props);

        this.state = {text: '',
                      pdf: '',
                      swipedir: '',
                      curPage:0,
        };

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

            if(touchobj === undefined){
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

                switch (this.swipedir) {
                    case 'left':
                        this.state.curPage++;
                        break;
                    case 'right':
                        this.state.curPage--;
                        break;

                    default:
                }

                console.log(this.state.curPage);

                if(this.state.curPage > 0){
                    this.openPage(this.state.curPage);
                }
            }
        }, false)
    }


    componentDidMount() {
        console.log('componentDidMount');
        var loadingTask = PDFJS.getDocument('http://localhost:3004').promise.then((pdfFile) => {
            this.setState({pdf: pdfFile});
            this.openPage(20);
        });
        console.log(this.state.loadingTask);
    }

    openPage(number){
            console.log('openPage');
            console.log(this.state.pdf);

            this.state.pdf.getPage(number).then(function(page) {
                var scale = 1.5;
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
        return (
            <div>
                <button onClick={()=>{
                    this.state.curPage++;
                    this.openPage(this.state.curPage);
                }
                }>
                    Активировать лазеры
                </button>

                <canvas id={'canvas'} width={640} height={425} tabIndex={1}/>
            </div>)
    }
}

export default ReadCanvas;
