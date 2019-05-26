export const SET_HISTORY = 'sujin/v2/history/SET_HISTORY';
export const SET_MATCHED = 'sujin/v2/history/SET_MATCHED';
export const SET_LOCATION = 'sujin/v2/history/SET_LOCATION';

export function setHistory(history) {
  return {
    type: SET_HISTORY,
    history,
  };
}

export function setMatched(matched) {
  return {
    type: SET_MATCHED,
    matched,
  };
}

export function setLocation(location) {
  return {
    type: SET_LOCATION,
    location: {
      ...window.location,
      ...location,
    },
  };
}
