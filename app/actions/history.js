export const SET_HISTORY = 'sujin/v2/history/SET_HISTORY';

export function setHistory(history) {
  return {
    type: SET_HISTORY,
    history,
  };
}
