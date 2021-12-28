import React, { Component } from 'react'
import GeoCanvas from './../classes/GeoCanvas'

export default class GeoPlayground extends Component {

  constructor(props) {
    super(props);
    this.initialState = {
      slack: 0,
      distortX: 0,
      distortY: 0,
      rotationDeg: 0,
      scale: 1,
      strokeWidth: 50,
      strokeFade: 0,
      opacity: 1,
      masterRotation: 0,
      masterWB: 0,
      mode: 'h',
    };
    this.state = this.initialState;
    this.canvasEl = React.createRef();
    this.cursor = React.createRef();
    this.position = {x: 0, y: 0, direction: 'down'};
    this.drawing = false;
    this.coordsQueue = [];
  }

  changeSlack(event, value) {
    this.redraw(value);
    this.setState({
      slack: value
    });
  }

  changeDistortX(event, value) {
    this.distort(value, this.state.distortY);
    this.setState({
      distortX: value
    });
  }

  changeDistortY(event, value) {
    this.distort(this.state.distortX, value);
    this.setState({
      distortY: value
    });
  }

  changeRotationDeg(event) {
    const val = parseInt(event.target.value);
    this.rotate(val)
    this.setState({
      rotationDeg: val
    });
  }

  distort(x, y) {
    this.canvas.distort(x, y);
  }

  rotate(deg) {
    let {axlesY, fAxleX, htTopX, htTopY, htBottomX, htBottomY, rAxleX, saddleX, saddleY} = this.props.dimensions;
    const centerHeadtube = {x: (htTopX + htBottomX) / 2, y: (htTopY + htBottomY) / 2};
    this.canvas.rotateFork(deg, centerHeadtube);

    // calc master rotation
    const ogA = axlesY - centerHeadtube.y;
    const ogB = fAxleX - centerHeadtube.x;
    const c = Math.sqrt(Math.pow(ogA, 2) + Math.pow(ogB, 2));
    // const ogAngle = Soh Cah Toa
    const degPerRad = 180 / Math.PI;
    const ogAngleDeg = 90 - (Math.asin(ogB / c) * degPerRad);
    const newAngleDeg = ogAngleDeg + deg;
    const newAngleRad = newAngleDeg / degPerRad;
    const newB = Math.cos(newAngleRad) * c;
    const newA = Math.sin(newAngleRad) * c;
    const diffA = newA - ogA;
    const diffB = newB - ogB;
    const newWB = fAxleX - rAxleX + diffB;
    const newMasterAngle = Math.asin(diffA / newWB) * degPerRad;
    this.setState({
      masterRotation: newMasterAngle
    })

    this.canvas.rotateSeat(newMasterAngle, {x: saddleX, y: saddleY});
  } 

  redraw(amount) {
    this.canvas.slackFork(amount);
  }

  initializeCanvas() {
    const { strokeWidth, strokeFade } = this.state;
    this.canvas = new GeoCanvas(this.canvasEl.current, this.props.dimensions, strokeWidth, strokeFade);
  }

  componentDidMount() {
    this.initializeCanvas();
    this.img = this.refs.img;
    this.img.onload = (function() {
      this.canvas.placeOriginalImage(this.img);
      // this.canvas.drawGround();
      this.canvas.drawBike();
      this.setState({
        scale: this.canvasEl.current.parentElement.offsetWidth / this.props.dimensions.width
      })
    }).bind(this);

    document.addEventListener('keypress', e => {
      if (e.key === 'r') {
        this.setState({
          opacity: this.state.opacity * -1
        });
      }
      if (e.key === 'h' || e.key === 's') {
        this.setState({
          mode: e.key
        });
      }
    })
  }

  startDraw = e => {
    this.drawing = true;
    this.coordsQueue = [];
    this.setPosition(e);
    this.pushCoordsQueue();
  }

  pushCoordsQueue() {
    this.coordsQueue.push([this.position.x, this.position.y, this.state.opacity, new Date().getTime()]);
  }

  stopDraw = () => {
    this.drawing = false;
    this.canvas.update();
    this.canvas.processCoordsQueue(this.coordsQueue, this.state.mode);

    if (this.state.mode === 'h') {
      Object.keys(this.canvas.cords).forEach(y => {
        Object.keys(this.canvas.cords[y]).forEach(x => {
          this.canvas.ctx.fillStyle = "rgba(255,0,0,"+this.canvas.cords[y][x]+")";
          this.canvas.ctx.fillRect( x, y, 1, 1 );
        })
      });
    } else {
      Object.keys(this.canvas.seatCords).forEach(y => {
        Object.keys(this.canvas.seatCords[y]).forEach(x => {
          this.canvas.ctx.fillStyle = "rgba(255,0,0,"+this.canvas.seatCords[y][x]+")";
          this.canvas.ctx.fillRect( x, y, 1, 1 );
        })
      });
    }
  }

  setPosition = e => {
    const {scale} = this.state;
    const rect = this.canvasEl.current.getBoundingClientRect();
    const leftStart = rect.left;
    const topStart = rect.top;

    const newx = Math.floor((e.clientX - leftStart) * (1/scale))
    const newy = Math.floor((e.clientY - topStart) * (1/scale));

    const dx = Math.abs(this.position.x - newx);
    const dy = Math.abs(this.position.y - newy);
    const newdirection = dx > dy ? (this.position.x < newx ? 'right' : 'left') : (this.position.y < newy ? 'down' : 'up');


    this.position.x = newx;
    this.position.y = newy;
    this.position.direction = newdirection;
  }

  draw = (e) => {
    if(e.metaKey) {
      this.setPosition(e);
      const {direction} = this.position;
      if (direction === 'right' || direction === 'left') {
        let newWidth = this.state.strokeWidth + (direction === 'right' ? 1 : -1);
        if (newWidth < 2) newWidth = 2;
        this.canvas.strokeWidth = newWidth;
        this.setState({
          strokeWidth: newWidth
        });
      }
      if (direction === 'up' || direction === 'down') {
        let newFade = this.state.strokeFade + (direction === 'up' ? 1 : -1);
        if (newFade < 0) newFade = 0;
        if (newFade > 100) newFade = 100;
        this.canvas.strokeFade = newFade;
        this.setState({
          strokeFade: newFade
        });
      }

      return;
    }

    const rect = this.canvasEl.current.getBoundingClientRect();
    const canvLeft = rect.left;
    const canvTop = rect.top;
    const cursorx = e.clientX - canvLeft;
    const cursory = e.clientY - canvTop;

    this.cursor.current.style.left = cursorx + 'px';
    this.cursor.current.style.top = cursory + 'px';
    this.cursor.current.style.transform = `translate(-50%, -50%) scale(${this.state.scale})`;

    if (!this.drawing) {
      this.setPosition(e);
      return
    }

    this.canvas.ctx.beginPath(); // begin

    this.canvas.ctx.lineWidth = this.state.strokeWidth;
    this.canvas.ctx.lineCap = 'round';
    this.canvas.ctx.strokeStyle = 'rgba(255,0,0,1)';

    this.canvas.ctx.moveTo(this.position.x, this.position.y);
    this.setPosition(e);
    this.canvas.ctx.lineTo(this.position.x, this.position.y);
    this.pushCoordsQueue();

    this.canvas.ctx.stroke();
  }

  render() {
    const {height, width, axlesY, rAxleX} = this.props.dimensions;
    // const {strokeWidth, strokeFade, opacity} = this.state;
    let aspectRatio = height / width * 100;
    return <>
      <div className={'stage'} style={{width: '100%', height: 0, paddingBottom: aspectRatio + '%', position: 'relative', overflow: 'hidden'}}>
        {/* <span class="cursor" data-opacity={opacity} data-width={strokeWidth} data-fade={strokeFade} ref={this.cursor} style={{position:'absolute', width:strokeWidth, height:strokeWidth, borderRadius:'50%', display:'block', border:'1px solid black', zIndex:1, pointerEvents:'none',backgroundImage:`radial-gradient(red ${strokeFade}%, transparent)`}}></span> */}
        <canvas ref={this.canvasEl} style={{position: 'absolute', left: '50%', top: '50%', width, height, transformOrigin: `${rAxleX}px ${axlesY}px`, transform: `translate(-50%, -50%) scale(${this.state.scale}) rotate(${-1 * this.state.masterRotation}deg)`}}/>
        <img ref="img" src={this.props.img} style={{display: 'none'}} alt={'bike'}/>
      </div>
      <input type="range" value={this.state.rotationDeg} min={-10} max={3} step={1} onChange={this.changeRotationDeg.bind(this)} />
    </>
  }

}
