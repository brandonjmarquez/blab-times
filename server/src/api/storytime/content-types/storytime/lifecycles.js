module.exports = {
  beforeCreate(event) {
  if (event.params.data.title && event.params.data.post) {
    event.params.data.api = "storytime";
  }
},

beforeUpdate(event) {
  if (event.params.data.title && event.params.data.post) {
    event.params.data.api = "storytime";
  }
},
};