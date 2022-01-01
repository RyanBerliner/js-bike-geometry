import React, { useState } from 'react';
import LegacyWorkbench from './legacy/components/PreviewFrame';
import Workbench from './Workbench';

function App() {
  const [isLegacy, setIsLegacy] = useState(false);
  const AppComponent = isLegacy ? LegacyWorkbench : Workbench;

  return <div className="App">
    <div className="alert alert-primary d-md-flex justify-content-between border-0 rounded-0 mb-0">
      <p className="mb-0">You are {isLegacy ? 'viewing the old' : 'previewing the new'} workbench.</p>
      <a href="#workbench" role="button" onClick={() => setIsLegacy(!isLegacy)} className="alert-link">
        View {isLegacy ? 'new' : 'old'} workbench
      </a>
    </div>
    <div id="workbench">
      <AppComponent />
    </div>
  </div>
}

export default App;
