import {Component, ElementRef, OnInit} from '@angular/core';
import {CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType} from 'angular-gridster2';
import {FractalisService} from '../../../../services/fractalis.service';
import {Chart} from '../../../../models/chart-models/chart';
import {ChartType} from '../../../../models/chart-models/chart-type';

@Component({
  selector: 'gb-fractalis-visual',
  templateUrl: './gb-fractalis-visual.component.html',
  styleUrls: ['./gb-fractalis-visual.component.css']
})
export class GbFractalisVisualComponent implements OnInit {

  cellWidth = 300;
  cellHeight = 300;
  margin = 10;
  options: GridsterConfig;
  items: Array<GridsterItem> = [];
  itemChartMap: Map<GridsterItem, Chart> = new Map<GridsterItem, Chart>();

  /*
   * TODO: create fractalis charts or cross table
   * based on the user input of chart type and variables in the gb-fractalis-control component
   */
  constructor(private fractalisService: FractalisService, private el: ElementRef) {
    this.fractalisService.chartAdded.asObservable()
      .subscribe((newChart: Chart) => {
        this.addItem(newChart);
      });
  }

  ngOnInit() {
    this.options = {
      gridType: GridType.VerticalFixed,
      compactType: CompactType.None,
      margin: this.margin,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      mobileBreakpoint: 640,
      minCols: 3,
      maxCols: 3,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 30,
      minItemCols: 1,
      maxItemRows: 30,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: this.cellWidth,
      fixedRowHeight: this.cellHeight,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      itemChangeCallback: this.adjustHeight.bind(this)
    };

    this.adjustHeight();
  }

  private addItem(chart: Chart) {
    const cols = chart.type === ChartType.CROSSTABLE ? 3 : 1;
    const rows = chart.type === ChartType.CROSSTABLE ? 2 : 1;
    let item = {x: 0, y: 0, cols: cols, rows: rows};
    this.itemChartMap.set(item, chart);
    this.items.push(item);
  }

  private adjustHeight() {
    let numRows = 0;
    this.items.forEach(item => {
      const row = item.y + item.rows - 1;
      numRows = item.y > numRows ? item.y : numRows;
    });
    numRows += 2;
    const h = numRows * (this.cellHeight + this.margin) + 20;
    this.el.nativeElement
      .querySelector('.fractalis-visual-container').style['height'] = h + 'px';
  }

  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();

    const chart = this.itemChartMap.get(item);
    this.fractalisService.removeChart(chart);
    this.items.splice(this.items.indexOf(item), 1);
    this.itemChartMap.delete(item);
  }

  clearItems() {
    this.fractalisService.charts.length = 0;
    this.items.length = 0;
    this.itemChartMap.clear();
    this.adjustHeight();
  }

  getChart(item: GridsterItem): Chart {
    return this.itemChartMap.get(item);
  }

}
