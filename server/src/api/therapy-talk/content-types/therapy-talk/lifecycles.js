module.exports = {
  beforeCreate(event) {
  if (event.params.data.title && event.params.data.post) {
    event.params.data.api = "therapy-talks";
  }
},

beforeUpdate(event) {
  if (event.params.data.title && event.params.data.post) {
    event.params.data.api = "therapy-talks";
  }
},
};