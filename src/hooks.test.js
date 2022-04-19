import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  beforeMiddleWare,
  afterMiddleWare,
  useReducerWithMiddleware
} from './hooks';

describe('middleware helpers', () => {
  it('generate proper before middleware', () => {
    const middleware = beforeMiddleWare('lorem');
    expect(middleware).toEqual({when: 'before', fn: 'lorem'});
  });

  it('generate proper after middleware', () => {
    const middleware = afterMiddleWare('lorem');
    expect(middleware).toEqual({when: 'after', fn: 'lorem'});
  });
});

describe('reducer with middleware hook', () => {
  it('fires all before and after middlewares with correct args', async () => {
    const mock1 = jest.fn();
    const mock2 = jest.fn();
    const mock3 = jest.fn();
    const mock4 = jest.fn();

    const before1 = beforeMiddleWare(mock1);
    const before2 = beforeMiddleWare(mock2);
    const after1 = afterMiddleWare(mock3);
    const after2 = afterMiddleWare(mock4);

    function reducer(state, _) {
      return {count: state.count + 1};
    }

    function Component() {
      const [state, dispatch] = useReducerWithMiddleware(
        reducer,
        {count: 0},
        undefined,
        [before1, before2, after1, after2]
      )

      return <button onClick={() => dispatch({action: 'lorem', payload: 'ipsum'})}>
        Button clicked {state.count} times
      </button>
    }

    render(<Component />);

    await userEvent.click(screen.getByText("Button clicked 0 times"));
    expect(mock1.mock.calls[0]).toEqual([{"action": "lorem", "payload": "ipsum"}, {"count": 0}]);
    expect(mock2.mock.calls[0]).toEqual([{"action": "lorem", "payload": "ipsum"}, {"count": 0}]);
    expect(mock3.mock.calls[0]).toEqual([[{"action": "lorem", "payload": "ipsum"}], {"count": 1}]);
    expect(mock4.mock.calls[0]).toEqual([[{"action": "lorem", "payload": "ipsum"}], {"count": 1}]);

    await userEvent.click(screen.getByText("Button clicked 1 times"));
    expect(mock1.mock.calls[1]).toEqual([{"action": "lorem", "payload": "ipsum"}, {"count": 1}]);
    expect(mock2.mock.calls[1]).toEqual([{"action": "lorem", "payload": "ipsum"}, {"count": 1}]);
    expect(mock3.mock.calls[1]).toEqual([[{"action": "lorem", "payload": "ipsum"}], {"count": 2}]);
    expect(mock4.mock.calls[1]).toEqual([[{"action": "lorem", "payload": "ipsum"}], {"count": 2}]);
  });
});
