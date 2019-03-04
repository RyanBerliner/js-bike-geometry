import React from 'react'

export default class GeoInitializer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editting: false,
      mouseX: 0,
      mouseY: 0
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
    console.log(e)
    this.setState({
      mouseX: e.nativeEvent.offsetX,
      mouseY: e.nativeEvent.offsetY
    });
  }

  render() {
    return <div className={'geo-initializer'} style={{position: 'relative', overflow: 'hidden'}} onMouseMove={this.onMouseMove.bind(this)} onMouseEnter={this.handleMouseHover.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
      <img src={this.props.img} width={'100%'}/>
      {true &&
        <div className={'editing-axis'}>
          <div className={'x-axis'} style={{position: 'absolute', top: this.state.mouseY, left: 0, height: 1, width: '100%', backgroundColor: 'black'}}></div>
          <div className={'y-axis'} style={{position: 'absolute', left: this.state.mouseX, top: 0, height: '100%', width: 1, backgroundColor: 'black'}}></div>
        </div>
      }
    </div>
  }
}
