import React, { Component } from 'react'
import GeoCanvas from './../classes/GeoCanvas'
import Slider from 'material-ui/Slider'

export default class GeoPlayground extends Component {

  constructor(props) {
    super(props);
    this.initialState = {
      slack: 0
    };
    this.state = this.initialState;
  }

  changeSlack(event, value) {
    this.setState({
      slack: value
    }, this.redraw());
  }

  resetPlayground(event) {
    this.setState(this.initialState, function() {
      this.canvas.bike.resetDimensions();
      this.redraw();
    }.bind(this));
  }

  redraw() {
    this.canvas.slackFork(this.state.slack);
  }

  initializeCanvas() {
    this.canvas = new GeoCanvas(this.refs.canvas, this.props.dimensions);
    this.canvas.fixDPI();
  }

  componentDidMount() {
    this.initializeCanvas();
    this.img = this.refs.img;
    this.img.onload = (function() {
      this.canvas.placeImage(this.img);
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
      <Slider
          value={this.state.slack}
          aria-labelledby="label"
          onChange={this.changeSlack.bind(this)}
          min={-40}
          max={40}
        />
      <button onClick={this.resetPlayground.bind(this)}>Reset</button>
    </div>
  }

}
