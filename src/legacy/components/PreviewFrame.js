import React, { Component } from 'react'
import GeoInitializer from './GeoInitializer';
import GeoPlayground from './GeoPlayground';

export default class PreviewFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'legacy/bike-image-3.jpg',
      mode: 'initialize',
      OGdimensions: {}
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
    return <div data-testid="old-workbench">
      <style>
        {`.cursor:before {
          content: attr(data-width) "/" attr(data-fade) "/" attr(data-opacity);
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, 50%);
        }`}
      </style>
      <div style={{width: '90%', border: '1px solid black', margin: '10px auto'}}>
        {windowView}
      </div>
      <div>
        <input type="text" value={this.state.image} onChange={this.changeImage.bind(this)} />
      </div>
    </div>
  }
}
