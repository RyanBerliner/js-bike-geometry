import React, { Component } from 'react'

export default class GeoInitializer extends Component {
  constructor(props) {
    super(props);
    this.processes = [
      ['x', 'groundY', 'Select the vertical height of the ground'],
      ['x', 'axlesY', 'Select the vertical height of the axles'],
      ['x', 'bbY', 'Select the vertical height of the bb'],
      ['x', 'saddleY', 'Select the vertical height of the top of the saddle'],
      ['x', 'htTopY', 'Select the vertical height of the top of the head tube'],
      ['x', 'htBottomY', 'Select the vertical height of the bottom of the head tube'],
      ['y', 'rAxleX', 'Select the horizontal level of the rear axle'],
      ['y', 'fAxleX', 'Select the horizontal level of the front axle'],
      ['y', 'bbX', 'Select the horizontal level of the bb'],
      ['y', 'saddleX', 'Select the horizontal level directly under the saddle'],
      ['y', 'htTopX', 'Select the horizontal level of the top of the head tube'],
      ['y', 'htBottomX', 'Select the horizontal level of the bottom of the head tube']
    ]
    this.state = {
      mouseX: 0,
      mouseY: 0,
      mouseXPerc: 0,
      mouseYPerc: 0,
      stepIndex: 0,
      imageMeta: {
        // groundY: null,
        // axlesY: null,
        // rAxleX: null,
        // fAxleX: null,
        // bbY: null,
        // bbX: null,
        // saddleY: null,
        // saddleX: null,
        // htTopY: null,
        // htTopX: null,
        // htBottomY: null,
        // htBottomX: null,
        axlesY:0.5976627712854758,
        bbX:0.6182336182336182,
        bbY:0.5976627712854758,
        fAxleX:0.4843304843304843,
        groundY:0.6043405676126878,
        htBottomX:0.7891737891737892,
        htBottomY:0.9048414023372288,
        htTopX:0.7977207977207977,
        htTopY:0.8998330550918197,
        rAxleX:0.4415954415954416,
        saddleX:0.7777777777777778,
        saddleY:0.5692821368948247
      }
    }
  }

  onMouseMove(e) {
    let newX = e.nativeEvent.offsetX;
    let newY = e.nativeEvent.offsetY;
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

  undoStep() {
    if (this.state.stepIndex > 0) {
      this.setState({
        stepIndex: this.state.stepIndex - 1
      });
    }
  }

  done() {
    let image = document.getElementById('bike-image');
    let dimensions = this.state.imageMeta;
    dimensions.height = image.clientHeight;
    dimensions.width = image.clientWidth;
    this.props.changeDimensions(dimensions);
    this.props.changeMode('playground');
  }

  selectDimension() {
    let currentStep = this.processes[this.state.stepIndex];
    let currentDimens = this.state.imageMeta;
    currentDimens[this.processes[this.state.stepIndex][1]] = (currentStep[0] === 'x') ? this.state.mouseXPerc : this.state.mouseYPerc;
    this.setState({
      imageMeta: currentDimens
    });
    if (this.state.stepIndex + 1 < this.processes.length) {
      this.setState({
        stepIndex: this.state.stepIndex + 1
      });
    } else {
      this.done();
    }
  }

  componentDidMount() {

  }

  render() {
    return <div className={'geo-initializer'} style={{position: 'relative', overflow: 'hidden'}} >
      <img ref="img" alt={'bike'} src={this.props.img} width={'100%'} id={'bike-image'} onMouseMove={this.onMouseMove.bind(this)} onClick={this.selectDimension.bind(this)}/>
      {true &&
        <div className={'editing-axis'}>
          {this.processes[this.state.stepIndex][0] === 'x' &&
            <div className={'x-axis'} style={{pointerEvents: 'none',position: 'absolute', top: this.state.mouseY, left: 0, height: 1, width: '100%', backgroundColor: 'black'}}></div>
          }
          {this.processes[this.state.stepIndex][0] === 'y' &&
            <div className={'y-axis'} style={{pointerEvents: 'none',position: 'absolute', left: this.state.mouseX, top: 0, height: '100%', width: 1, backgroundColor: 'black'}}></div>
          }
        </div>
      }
      <div style={{position: 'relative', zIndex: 2, backgroundColor: 'red'}}>
        <button onClick={this.undoStep.bind(this)}>Undo</button>
        <p>({this.state.stepIndex + 1}/{this.processes.length}) {this.processes[this.state.stepIndex][2]}</p>
        <button onClick={this.done.bind(this)}>Done</button>
      </div>
    </div>
  }
}
