import React, { useState } from 'react';
import LegacyWorkbench from './legacy/components/PreviewFrame';
import Workbench from './Workbench';

function App() {
  const [isLegacy, setIsLegacy] = useState(false);
  const AppComponent = isLegacy ? LegacyWorkbench : Workbench;

  return <div className="App">
    <button onClick={() => setIsLegacy(!isLegacy)}>
      View {isLegacy ? 'new' : 'old'} workbench
    </button>
    <AppComponent />
  </div>
}

export default App;
