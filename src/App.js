import React, { Component } from 'react';
import PreviewFrame from './components/PreviewFrame';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'configure'
    }
  }

  render() {
    return (
      <div className="App" style={{backgroundColor: '#efefef'}}>
        <PreviewFrame mode={this.state.configure}/>
      </div>
    );
  }
}

export default App;
