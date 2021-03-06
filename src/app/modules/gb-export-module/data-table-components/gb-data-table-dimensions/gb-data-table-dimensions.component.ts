/**
 * Copyright 2017 - 2018  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Component, OnInit} from '@angular/core';
import {TableDimension} from '../../../../models/table-models/table-dimension';
import {DataTableService} from '../../../../services/data-table.service';

@Component({
  selector: 'gb-data-table-dimensions',
  templateUrl: './gb-data-table-dimensions.component.html',
  styleUrls: ['./gb-data-table-dimensions.component.css']
})
export class GbDataTableDimensionsComponent implements OnInit {

  constructor(private dataTableService: DataTableService) {
  }

  ngOnInit() {
  }

  onChange() {
    this.dataTableService.validateDimensions();
  }

  /**
   * This function handles the drop event when the user is reordering dimensions within
   * the same row-dimension container or the same column-dimension container
   */
  onDrop(e) {
    e.preventDefault();
    let changed = false;
    if (this.dataTableService.prevRowDimensions.length === this.dataTableService.rowDimensions.length) {
      for (let i = 0; i < this.dataTableService.rowDimensions.length; i++) {
        const prev = this.dataTableService.prevRowDimensions[i].name;
        const current = this.dataTableService.rowDimensions[i].name;
        if (prev !== current) {
          changed = true;
          break;
        }
      }
    }
    if (!changed) {
      if (this.dataTableService.prevColDimensions.length === this.dataTableService.columnDimensions.length) {
        for (let i = 0; i < this.dataTableService.columnDimensions.length; i++) {
          const prev = this.dataTableService.prevColDimensions[i].name;
          const current = this.dataTableService.columnDimensions[i].name;
          if (prev !== current) {
            changed = true;
            break;
          }
        }
      }
    }
    if (changed) {
      this.onChange();
    }
  }

  get rowDimensions(): TableDimension[] {
    return this.dataTableService.rowDimensions;
  }

  set rowDimensions(value: TableDimension[]) {
    this.dataTableService.rowDimensions = value;
  }

  get columnDimensions(): TableDimension[] {
    return this.dataTableService.columnDimensions;
  }

  set columnDimensions(value: TableDimension[]) {
    this.dataTableService.columnDimensions = value;
  }

}


