import React from 'react'

export default class GeoInitializer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editting: false,
      mouseX: 0,
      mouseY: 0,
      mouseXPerc: 0,
      mouseYPerc: 0
    }
  }

  handleMouseHover() {
    this.setState({
      editting: true
    });
  }

  handleMouseLeave() {
    this.setState({
      editting: false
    });
  }

  onMouseMove(e) {
    // The > 10 is a tolerance so it doesn't reset to 0... not sure the issue here
    let newX = (e.nativeEvent.offsetX > 10) ? e.nativeEvent.offsetX : this.state.mouseX;
    let newY = (e.nativeEvent.offsetY > 10) ? e.nativeEvent.offsetY : this.state.mouseY;
    let image = document.getElementById('bike-image');
    let height = image.clientHeight;
    let width = image.clientWidth;
    this.setState({
      mouseX: newX,
      mouseY: newY,
      mouseXPerc: newX / width,
      mouseYPerc: newY / height
    });
  }

  render() {
    return <div className={'geo-initializer'} style={{position: 'relative', overflow: 'hidden'}} onMouseMove={this.onMouseMove.bind(this)} onMouseEnter={this.handleMouseHover.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
      <img src={this.props.img} width={'100%'} id={'bike-image'}/>
      {true &&
        <div className={'editing-axis'}>
          <div className={'x-axis'} style={{position: 'absolute', top: this.state.mouseY, left: 0, height: 1, width: '100%', backgroundColor: 'black'}}></div>
          <div className={'y-axis'} style={{position: 'absolute', left: this.state.mouseX, top: 0, height: '100%', width: 1, backgroundColor: 'black'}}></div>
        </div>
      }
      <div>
        Mouse X: {this.state.mouseXPerc}<br/>
        Mouse Y: {this.state.mouseYPerc}
      </div>
    </div>
  }
}
