module.exports = {
  beforeCreate(event) {
  if (event.params.data.title && event.params.data.post) {
    event.params.data.api = "poetry";
  }
},

beforeUpdate(event) {
  if (event.params.data.title && event.params.data.post) {
    event.params.data.api = "poetry";
  }
},
};