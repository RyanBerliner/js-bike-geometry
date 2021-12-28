import React, { Component } from 'react';
import PreviewFrame from './components/PreviewFrame';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'configure'
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <PreviewFrame mode={this.state.configure}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
