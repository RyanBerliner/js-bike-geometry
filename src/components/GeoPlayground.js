import React, { Component } from 'react'
import GeoCanvas from './../classes/GeoCanvas'
import Slider from 'material-ui/Slider'

export default class GeoPlayground extends Component {

  constructor(props) {
    super(props);
    this.initialState = {
      slack: 0,
      distortX: 0,
      distortY: 0,
      rotationDeg: 0,
      rotationOrigin: 300,
      scale: 1
    };
    this.state = this.initialState;
    this.canvasEl = React.createRef();
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

  changeRotationDeg(event, value) {
    this.rotate(value, this.state.rotationOrigin)
    this.setState({
      rotationDeg: value
    });
  }

  changeRotationOrigin(event) {
    this.rotate(this.state.rotationDeg, event.target.value);
    this.setState({
      rotationOrigin: event.target.value
    });
  }

  distort(x, y) {
    this.canvas.distort(x, y);
  }

  rotate(deg, origin) {
    origin = parseInt(origin);
    this.canvas.rotate(deg, {x: origin, y: origin});
  } 

  redraw(amount) {
    this.canvas.slackFork(amount);
  }

  initializeCanvas() {
    this.canvas = new GeoCanvas(this.canvasEl.current, this.props.dimensions);
    this.canvas.fixDPI();
  }

  componentDidMount() {
    this.initializeCanvas();
    this.img = this.refs.img;
    this.img.onload = (function() {
      this.canvas.placeOrigionalImage(this.img);
      this.canvas.drawGround();
      this.canvas.drawBike();
      this.setState({
        scale: this.canvasEl.current.parentElement.offsetWidth / this.props.dimensions.width
      })
    }).bind(this);
  }

  render() {
    const {height, width} = this.props.dimensions;
    let aspectRatio = height / width * 100;
    return <div>
      <div className={'stage'} style={{width: '100%', height: 0, paddingBottom: aspectRatio + '%', position: 'relative', overflow: 'hidden'}}>
        <canvas ref={this.canvasEl} style={{position: 'absolute', left: '50%', top: '50%', width, height, transformOrigin: 'center', transform: `translate(-50%, -50%) scale(${this.state.scale})`}}/>
        <img ref="img" src={this.props.img} style={{display: 'none'}} alt={'bike'}/>
      </div>
      <p>Test canvas distort</p>
      <p>Rotation origin</p>
      <input
        type="number"
        value={this.state.rotationOrigin}
        onChange={this.changeRotationOrigin.bind(this)}
        step={25}
      />
      <p>Rotation Degrees</p>
      <Slider
          value={this.state.rotationDeg}
          aria-labelledby="label"
          onChange={this.changeRotationDeg.bind(this)}
          min={-359}
          max={359}
          step={1}
        />
      <p>Distory X</p>
      <Slider
          value={this.state.distortX}
          aria-labelledby="label"
          onChange={this.changeDistortX.bind(this)}
          min={-50}
          max={50}
          step={1}
        />
      <p>Distory Y</p>
      <Slider
          value={this.state.distortY}
          aria-labelledby="label"
          onChange={this.changeDistortY.bind(this)}
          min={-50}
          max={50}
          step={1}
        />
            <p>Change bike geo</p>
      <Slider
          value={this.state.slack}
          aria-labelledby="label"
          onChange={this.changeSlack.bind(this)}
          min={-40}
          max={40}
        />
    </div>
  }

}
