import React from 'react';

import Sidebar from './Sidebar';
import Stage from './Stage';
import Toolbar from './Toolbar';
import { reducer, INITIAL_DATA } from './workbenchReducer';
import { useReducerWithMiddleware } from './hooks';
import { localPersistance } from './localPersistance';
import { CanvasDistort } from './lib/CanvasDistort';
import { WorkbenchMiddleware } from './lib/CanvasDistortMiddleware';

const canvasDistort = new CanvasDistort();

export default function Workbench() {
  const {read, middleware} = localPersistance('__geo_workbench_data__');
  const [data, dispatch] = useReducerWithMiddleware(
    reducer,
    INITIAL_DATA,
    initialData => {
      const initial = {
      // This is not perfect... but good enough for now. May need to replace with
      // a more thought our merge function from the reducer file.
      ...initialData,
      ...read()
      };

      // Initialize canvas distort with initial values
      canvasDistort.zoom = initial.stageZoom;
      canvasDistort.posX = initial.stageX;
      canvasDistort.posY = initial.stageY;
      canvasDistort.imageUrl = initial.imageUrl;
      canvasDistort.imageDetails = initial.imageDetails;

      return initial;
    },
    [middleware, WorkbenchMiddleware(canvasDistort)]
  );

  return <div className="vh-100 d-flex" data-testid="workbench">
    <div className="container-fluid flex-grow-1 d-flex">
      <div className="row flex-grow-1">
        <div className="col-md-8 col-lg-9 d-flex flex-column">
          <div className="border-bottom py-2 row">
            <div className="col">
              <Toolbar data={data} dispatch={dispatch} />
            </div>
          </div>
          <div className="row flex-grow-1">
            <Stage canvasDistort={canvasDistort} />
          </div>
        </div>
        <div className="col-md-4 col-lg-3 border-start mh-100 overflow-auto">
          <Sidebar data={data} dispatch={dispatch} />
        </div>
      </div>
    </div>
  </div>
}
