const selectors = require('../../app/selectors');

const state = {};
const data = {
  withSelect: (mapSelectToProps) => {
    console.log(selectors);
    console.log(mapSelectToProps);
  }
};

export default data;
