import React from 'react'
import GeoInitializer from './GeoInitializer';

export default class PreviewFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'https://www.commencalusa.com/Files/106799/Img/20/19METAAMRSI_2000.jpg'
    }
  }

  changeImage(e) {
    this.setState({
      image: e.target.value
    });
  }

  render() {
    return <div>
      <div style={{width: '90%', border: '1px solid black', margin: '10px auto'}}>
        <GeoInitializer img={this.state.image}/>
      </div>

      <div>
        <input type="text" value={this.state.image} onChange={this.changeImage.bind(this)} />
      </div>
    </div>
  }
}