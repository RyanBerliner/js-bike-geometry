import React, { Component } from 'react'
import GeoInitializer from './GeoInitializer';
import GeoPlayground from './GeoPlayground';

export default class PreviewFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'bike-image-3.jpg',
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
    return <div>
      <div style={{width: '90%', border: '1px solid black', margin: '10px auto'}}>
        {windowView}
      </div>
      <div>
        <input type="text" value={this.state.image} onChange={this.changeImage.bind(this)} />
      </div>
    </div>
  }
}
