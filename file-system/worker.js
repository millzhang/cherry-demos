/**
 * @param  {} fmt
 * @param  {} date
 */
Date.prototype.format = function(fmt) {
  let date = this;
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
};

function generate_data() {
  let data = [];
  for (let i = 0; i < 1000; i++) {
    let d = new Date(Date.now() + i * 1000);
    data.push({
      id: i + 1,
      name: '文件夹_' + i,
      updatetime: d.format('yyyy-MM-dd hh:mm:ss'),
      size: parseFloat(Math.random() * 100 + 1).toFixed(2) + 'kb'
    });
  }
  return data;
}

function complex_data(data) {
  let source_data = generate_data();
  let header = data.header;
  let settings = data.settings;
  let width = (settings.width - settings.startX - 1) / header.length;
  let height = 60;
  let header_data = {};
  header_data.drawers = header.map((item, index) => {
    return {
      x: settings.startX + width * index,
      y: settings.startY,
      tx: settings.startX + width * index,
      ty:
        settings.startY +
        height / 2 -
        settings.paddings -
        settings.fontSize / 2,
      fill: '#f5f7fa',
      paddings: settings.paddings,
      color: '#909399',
      text: item,
      width: width,
      height: height,
      fontSize: settings.fontSize
    };
  });
  let body = source_data.map((ditem, sindex) => {
    // sindex:第几行 cindex:第几列
    let y = settings.startY + height * (sindex + 1);
    let draws = header.map((item, cindex) => {
      let x = settings.startX + width * cindex;
      return {
        x: x,
        y: y,
        tx: x,
        ty: y + height / 2 - settings.paddings - settings.fontSize / 2,
        text: Object.values(ditem)[cindex],
        fill: sindex % 2 == 0 ? '#ecf5ff' : '#f5f7fa',
        paddings: settings.paddings,
        color: '#909399',
        width: width,
        height: height,
        fontSize: settings.fontSize
      };
    });
    ditem.drawers = draws;
    return ditem;
  });

  return {
    header: header_data,
    body: body
  };
}

self.onmessage = function(evt) {
  let data = evt.data;
  postMessage(complex_data(data));
};
