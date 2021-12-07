import { useState, useEffect } from 'react';

/**
 * 定義全局變數，在入口文件使用，使底下元件都能取得同一組變數
 */
let globalState = {};
let listeners = [];
let actions = {};

/**
 * 管理全局變數
 */
export const useStore = (shouldListen = false) => {
  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload);
    globalState = { ...globalState, ...newState };
    for (const listener of listeners) {
      listener(globalState);
    }
  };

  /**
   * 註冊私有 setState，有變化時執行 listener
   * 使有用 useStore 的 com re-render
   *  */
  const [, setState] = useState(globalState);
  useEffect(() => {
    shouldListen && listeners.push(setState);
    return () => {
      shouldListen && (listeners = listeners.filter((li) => li !== setState));
    };
  }, [setState, shouldListen]);

  return [globalState, dispatch];
};

export const initStore = (userActions = {}, initialState = {}) => {
  globalState = { ...globalState, ...initialState };
  actions = { ...actions, ...userActions };
};
