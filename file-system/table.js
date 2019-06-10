import { createButton } from './components/button.js';
export default class Table {
  constructor(container, settings = {}) {
    this.settings = Object.assign(
      {
        width: window.innerWidth,
        height: window.innerHeight,
        lineColor: '#ababab',
        startX: window.innerWidth / 8,
        startY: window.innerHeight / 10,
        lineWidth: 1,
        fontSize: 14,
        paddings: 20
      },
      settings
    );
    this.stage = new Konva.Stage({
      container: container,
      width: this.settings.width,
      height: this.settings.height
    });
    this.worker = new Worker('worker.js');
  }

  initLayout() {
    let layout_layer = new Konva.Layer();
    // tree 目录分隔线
    let treeLine = new Konva.Line({
      points: [
        this.settings.startX,
        0,
        this.settings.startX,
        this.settings.height
      ],
      stroke: this.settings.lineColor,
      strokeWidth: this.settings.lineWidth
    });
    // button-data分隔线
    let buttonLine = new Konva.Line({
      points: [
        this.settings.startX,
        this.settings.startY,
        this.settings.width,
        this.settings.startY
      ],
      stroke: this.settings.lineColor,
      strokeWidth: this.settings.lineWidth
    });
    layout_layer.add(treeLine);
    layout_layer.add(buttonLine);
    this.stage.add(layout_layer);
    this.drawTable();
  }

  drawLine(line, layer) {
    line.drawers.map(item => {
      let rect = new Konva.Rect({
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        fill: item.fill,
        stroke: '#ababab',
        strokeWidth: 0.5
      });
      let text = new Konva.Text({
        x: item.tx,
        y: item.ty,
        text: item.text,
        fontSize: item.fontSize,
        fontFamily: 'Calibri',
        fill: item.color,
        width: item.width,
        padding: item.paddings,
        align: 'center'
      });
      layer.add(rect);
      layer.add(text);
    });
    return layer;
  }

  drawTable() {
    let dataLayer = new Konva.Layer();
    let headers = ['ID', '名称', '修改日期', '大小'];
    this.worker.postMessage({
      header: headers,
      settings: this.settings
    });
    this.worker.onmessage = evt => {
      var group = new Konva.Group({
        x: 0,
        y: 0,
        rotation: 0
      });
      this.drawLine(evt.data.header, dataLayer);
      evt.data.body.map((item, index) => {
        this.drawLine(item, group);
      });
      this.worker.terminate();
      dataLayer.add(group);
      this.stage.add(dataLayer);
    };
  }
  // render data layer
  // random data list
}
