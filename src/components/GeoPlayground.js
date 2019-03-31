import React, { Component } from 'react'
import GeoCanvas from './../classes/GeoCanvas'
import Slider from 'material-ui/Slider'

export default class GeoPlayground extends Component {

  constructor(props) {
    super(props);
    this.initialState = {
      slack: 0,
      distort: 0
    };
    this.state = this.initialState;
  }

  changeSlack(event, value) {
    this.redraw(value);
    this.setState({
      slack: value
    });
  }

  changeDistort(event, value) {
    this.distort(value)
    this.setState({
      distort: value
    });
  }

  distort(amount) {
    this.canvas.distort(amount);
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
      <p>Change bike geo</p>
      <Slider
          value={this.state.slack}
          aria-labelledby="label"
          onChange={this.changeSlack.bind(this)}
          min={-40}
          max={40}
        />
      <p>Test canvas distort</p>
      <Slider
          value={this.state.distort}
          aria-labelledby="label"
          onChange={this.changeDistort.bind(this)}
          min={0}
          max={100}
          step={5}
        />
    </div>
  }

}
