var i = 0;
setInterval(() => {
  i++;
  postMessage(i);
}, 100);

self.onmessage = function(e) {
  var data = e.data;
  console.log(data);
};
