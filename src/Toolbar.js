import React from 'react';
import {Dropdown} from 'bs5-react-elements';

export default function Toolbar() {
  return <>
    <div className="d-lg-none text-center text-muted">
      Please use a larger screen to make adjustments.
    </div>
    <div className="d-none d-lg-flex justify-content-between">
      <div className="dropdown">
        <Dropdown
          as="a"
          className="dropdown-toggle"
          type="button"
          id="toolbar-menu-dropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Help
        </Dropdown>
        <ul className="dropdown-menu" aria-labelledby="toolbar-menu-dropdown">
          <li>
            <a className="dropdown-item" href="https://github.com/RyanBerliner/js-bike-geometry/issues" target="_blank" rel="noreferrer">
              Report an issue
            </a>
          </li>
        </ul>
      </div>
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center border-end pe-3 me-3" style={{minWidth: 0}}>
          <div className="mb-0 fw-bold me-3 pe-3 border-end">Brush</div>
          <div className="row g-3">
            <div className="col d-flex align-items-center">
              <label className="form-label me-2 mb-0" htmlFor="brush-size">Size</label>
              <input value="20" className="form-control form-control-sm" id="brush-size" type="number" style={{width: '4.5em'}} min="0" />
            </div>
            <div className="col d-flex align-items-center">
              <label className="form-label me-2 mb-0" htmlFor="brush-opacity">Opacity</label>
              <input value="100" className="form-control form-control-sm" id="brush-opacity" type="number" style={{width: '4.5em'}} min="0" max="100" />
            </div>
            <div className="col d-flex align-items-center">
              <label className="form-label me-2 mb-0" htmlFor="brush-fade">Fade</label>
              <input value="0" className="form-control form-control-sm" id="brush-fade" type="number" style={{width: '4.5em'}} min="0" max="100" />
            </div>
          </div>
        </div>
        <div className="d-flex">
          <label className="form-label me-2 mb-0" htmlFor="stage-zoom">
            <span className="visually-hidden">Stage Zoom</span>
            <i className="bi bi-zoom-in" aria-hidden="true" />
          </label>
          <input value="100" min="10" max="500" type="range" className="form-range" id="stage-zoom" />
        </div>
      </div>
    </div>
  </>
}
