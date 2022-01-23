import React from 'react';

import Sidebar from './Sidebar';
import Stage from './Stage';
import Toolbar from './Toolbar';
import { reducer, INITIAL_DATA } from './workbenchReducer';
import { useReducerWithMiddleware, beforeMiddleWare, afterMiddleWare } from './hooks';

export default function Workbench() {
  const [data, dispatch] = useReducerWithMiddleware(reducer, INITIAL_DATA, undefined, [
    beforeMiddleWare((action, state) => console.log('before', action, state)),
    afterMiddleWare((actions, state) => console.log('after', actions, state)),
  ]);

  return <div className="vh-100 d-flex" data-testid="workbench">
    <div className="container-fluid flex-grow-1 d-flex">
      <div className="row flex-grow-1">
        <div className="col-md-8 col-lg-9 d-flex flex-column">
          <div className="border-bottom py-2 row">
            <div className="col">
              <Toolbar />
            </div>
          </div>
          <div className="row flex-grow-1">
            <Stage />
          </div>
        </div>
        <div className="col-md-4 col-lg-3 border-start mh-100 overflow-auto">
          <Sidebar data={data} dispatch={dispatch} />
        </div>
      </div>
    </div>
  </div>
}