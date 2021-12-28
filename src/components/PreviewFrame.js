import React, { Component } from 'react'
import GeoInitializer from './GeoInitializer';
import GeoPlayground from './GeoPlayground';

export default class PreviewFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'bike-image-3.jpg',
      mode: 'playground',
      OGdimensions: {
        axlesY: 520.0573065902579,
        bbX: 654.7277936962751,
        bbY: 527.2206303724928,
        fAxleX: 1037.2492836676217,
        groundY: 681.948424068768,
        htBottomX: 902.5787965616046,
        htBottomY: 292.26361031518627,
        htTopX: 878.2234957020057,
        htTopY: 240.68767908309457,
        rAxleX: 458.45272206303724,
        saddleX: 598.8538681948424,
        saddleY: 246.41833810888252,
        height: 879,
        width: 1500
      }
    }
    this.changeMode = this.changeMode.bind(this);
    this.changeDimensions = this.changeDimensions.bind(this);
  }

  changeImage(e) {
    this.setState({
      image: e.target.value,
      mode: 'initialize'
    });
  }

  changeMode(mode) {
    this.setState({
      mode: mode
    });
  }

  changeDimensions(dimensions) {
    this.setState({
      OGdimensions: dimensions
    });
  }

  render() {
    let windowView = (this.state.mode === 'initialize') ? <GeoInitializer img={this.state.image} changeMode={this.changeMode} changeDimensions={this.changeDimensions}/> : <GeoPlayground img={this.state.image} dimensions={this.state.OGdimensions} />;
    return windowView
  }
}
