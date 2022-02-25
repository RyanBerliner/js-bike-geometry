import { useReducer, useMemo, useRef, useEffect } from "react";

export const beforeMiddleWare = fn => ({when: 'before', fn});
export const afterMiddleWare = fn => ({when: 'after', fn});

export function useReducerWithMiddleware(reducer, initialArg, init, middleware) {
  const [state, dispatch] = useReducer(reducer, initialArg, init);
  const actionRef = useRef([]);

  if (!Array.isArray(middleware)) {
    middleware = [middleware].filter(m => m != null);
  }

  const before = useMemo(() => middleware.filter(m => m.when === 'before'), [middleware]);
  const after = useMemo(() => middleware.filter(m => m.when === 'after'), [middleware]);

  const hookedDispatch = action => {
    actionRef.current.push(action);
    before.forEach(b => b.fn(action, state));
    dispatch(action);
  }

  useEffect(() => {
    if (actionRef.current.length === 0) {
      return;
    }

    after.forEach(a => a.fn(actionRef.current, state))
    actionRef.current = [];
  }, [state, after, actionRef])

  for (let i = 0; i < middleware.length; i++) {
    if (middleware[i].when == null || middleware[i].fn == null) {
      console.error('Invalid reducer middleware. No middleware will be applied.')
      return [state, dispatch];
    }
  }

  return [state, hookedDispatch];
}