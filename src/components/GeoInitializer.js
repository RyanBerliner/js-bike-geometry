import React, { Component } from 'react'

export default class GeoInitializer extends Component {
  constructor(props) {
    super(props);
    this.processes = [
      ['y', 'groundY', 'Select the vertical height of the ground'],
      ['y', 'axlesY', 'Select the vertical height of the axles'],
      ['y', 'bbY', 'Select the vertical height of the bb'],
      ['y', 'saddleY', 'Select the vertical height of the top of the saddle'],
      ['y', 'htTopY', 'Select the vertical height of the top of the head tube'],
      ['y', 'htBottomY', 'Select the vertical height of the bottom of the head tube'],
      ['x', 'rAxleX', 'Select the horizontal level of the rear axle'],
      ['x', 'fAxleX', 'Select the horizontal level of the front axle'],
      ['x', 'bbX', 'Select the horizontal level of the bb'],
      ['x', 'saddleX', 'Select the horizontal level directly under the saddle'],
      ['x', 'htTopX', 'Select the horizontal level of the top of the head tube'],
      ['x', 'htBottomX', 'Select the horizontal level of the bottom of the head tube']
    ]
    this.state = {
      mouseX: 0,
      mouseY: 0,
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

        // These are temps so I don't need to select them every time when testing.
        axlesY:332,
        bbX:358,
        bbY:335,
        fAxleX:681,
        groundY:474,
        height:501,
        htBottomX:564,
        htBottomY:121,
        htTopX:539,
        htTopY:79,
        rAxleX:170,
        saddleX:291,
        saddleY:55

      }
    }
  }

  onMouseMove(e) {
    let newX = e.nativeEvent.offsetX;
    let newY = e.nativeEvent.offsetY;
    this.setState({
      mouseX: newX,
      mouseY: newY
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
    dimensions.height = image.naturalHeight;
    dimensions.width = image.naturalWidth;
    this.props.changeDimensions(dimensions);
    this.props.changeMode('playground');
  }

  selectDimension() {
    let currentStep = this.processes[this.state.stepIndex];
    let currentDimens = this.state.imageMeta;
    currentDimens[this.processes[this.state.stepIndex][1]] = (currentStep[0] === 'x') ? this.state.mouseX : this.state.mouseY;
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

  render() {
    return <div className={'geo-initializer'} style={{position: 'relative', overflow: 'hidden'}} >
      <img ref="img" alt={'bike'} src={this.props.img} width={'100%'} id={'bike-image'} onMouseMove={this.onMouseMove.bind(this)} onClick={this.selectDimension.bind(this)}/>
      {true &&
        <div className={'editing-axis'}>
          {this.processes[this.state.stepIndex][0] === 'y' &&
            <div className={'x-axis'} style={{pointerEvents: 'none',position: 'absolute', top: this.state.mouseY, left: 0, height: 1, width: '100%', backgroundColor: 'black'}}></div>
          }
          {this.processes[this.state.stepIndex][0] === 'x' &&
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
