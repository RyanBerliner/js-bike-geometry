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
    };
    this.state = this.initialState;
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
    this.rotate(value)
    this.setState({
      rotationDeg: value
    });
  }

  distort(x, y) {
    this.canvas.distort(x, y);
  }

  rotate(deg) {
    this.canvas.rotate(deg);
  } 

  redraw(amount) {
    this.canvas.slackFork(amount);
  }

  initializeCanvas() {
    this.canvas = new GeoCanvas(this.refs.canvas, this.props.dimensions);
    this.canvas.fixDPI();
  }

  componentDidMount() {
    this.initializeCanvas();
    this.img = this.refs.img;
    this.img.onload = (function() {
      this.canvas.placeOrigionalImage(this.img);
      this.canvas.drawGround();
      this.canvas.drawBike();
    }).bind(this);
  }

  render() {
    let aspectRatio = this.props.dimensions.height / this.props.dimensions.width * 100;
    return <div>
      <div className={'stage'} style={{width: '100%', height: 0, paddingBottom: aspectRatio + '%', position: 'relative'}}>
        <canvas ref="canvas" style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'}}/>
        <img ref="img" src={this.props.img} style={{display: 'none'}} alt={'bike'}/>
      </div>
      <p>Test canvas distort</p>
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
