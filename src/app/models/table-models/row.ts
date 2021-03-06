/**
 * Copyright 2017 - 2018  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Col} from './col';
import {FormatHelper} from '../../utilities/format-helper';

export class Row {
  /*
   * The row data can be used like this in a table, combined with columns
   * cols ------> cols[0],           cols[1],           cols[2]
   * row  ------> row.data[_col[0]], row.data[_col[1]], row.data[_col[2]]
   */
  private _data: object;
  private _metadata: Map<string, Map<string, string>>;
  private _metadataText: Map<string, string>;
  private _length = 0;
  private _isHeaderRow = false;
  private _headerCellCount = 0;

  constructor() {
    this.data = {};
    this.metadata = new Map<string, Map<string, string>>();
    this.metadataText = new Map<string, string>();
  }

  /**
   * Add a simple datum to the data array of the row,
   * with the defined field as the key, pointing to the value
   * @param value
   * @param {Map<string, string>} metadataValue
   */
  addDatum(value: any, metadataValue?: Map<string, string>) {
    this.length++;
    const field = Col.COLUMN_FIELD_PREFIX + this.length.toString();
    this.data[field] = value;
    if (metadataValue != null && metadataValue.size) {
      this.data[field] += ' ⓘ';
      this.metadata[field] = metadataValue;
      this.metadataText[field] = FormatHelper.formatMetadata(metadataValue);
    }
  }

  addHeader(value: any, metadataValue?: Map<string, string>) {
    this.addDatum(value, metadataValue);
    this._headerCellCount++;
  }

  /**
   * Add a datum to the data array of the row,
   * with more complex structure than addDatum,
   * mainly used to add more information to a datum.
   * DO NOT use addDatum() and addDatumObject() together.
   * @param obj
   */
  addDatumObject(obj: object) {
    this.length++;
    const field = Col.COLUMN_FIELD_PREFIX + this.length.toString();
    this.data[field] = obj;
  }

  render(field: string): string {
    return FormatHelper.formatValue(this._data[field]);
  }

  get data(): Object {
    return this._data;
  }

  set data(value: Object) {
    this._data = value;
  }

  get length(): number {
    return this._length;
  }

  set length(value: number) {
    this._length = value;
  }

  get metadata(): Map<string, Map<string, string>> {
    return this._metadata;
  }

  set metadata(value: Map<string, Map<string, string>>) {
    value.forEach((map, field) => {
      this.metadataText[field] = FormatHelper.formatMetadata(map);
    });
    this._metadata = value;
  }

  get metadataText(): Map<string, string> {
    return this._metadataText;
  }

  set metadataText(value: Map<string, string>) {
    this._metadataText = value;
  }

  get isHeaderRow(): boolean {
    return this._isHeaderRow;
  }

  set isHeaderRow(value: boolean) {
    this._isHeaderRow = value;
  }

  get headerCellCount(): number {
    return this._headerCellCount;
  }

}
