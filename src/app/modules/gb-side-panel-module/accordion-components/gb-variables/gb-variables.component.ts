/**
 * Copyright 2017 - 2019  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {Component, OnInit} from '@angular/core';
import {FileImportHelper} from '../../../../utilities/file-import-helper';
import {MessageHelper} from '../../../../utilities/message-helper';
import {VariablesViewMode} from '../../../../models/variables-view-mode';
import {SelectItem} from 'primeng/api';
import {NavbarService} from '../../../../services/navbar.service';
import {VariableService} from '../../../../services/variable.service';
import {Concept} from '../../../../models/constraint-models/concept';
import {GbTreeNode} from '../../../../models/tree-node-models/gb-tree-node';

@Component({
  selector: 'gb-variables',
  templateUrl: './gb-variables.component.html',
  styleUrls: ['./gb-variables.component.css']
})
export class GbVariablesComponent implements OnInit {

  public viewMode: VariablesViewMode;
  public availableViewModes: SelectItem[];

  public VariablesViewMode = VariablesViewMode; // make enum visible in template
  public readonly variableFileElementId: string = 'variablesCriteriaFileUpload';

  public isUploadListenerNotAdded: boolean;
  public file: File; // holds the uploaded cohort file

  constructor(private variableService: VariableService,
              private navbarService: NavbarService) {
    this.isUploadListenerNotAdded = true;
  }

  ngOnInit() {
    this.availableViewModes = this.listAvailableViewModes();
    this.viewMode = VariablesViewMode.TREE_VIEW;
  }

  private listAvailableViewModes(): SelectItem[] {
    return Object.keys(VariablesViewMode).map(c => {
      return {
        label: VariablesViewMode[c],
        value: VariablesViewMode[c]
      }
    }) as SelectItem[];
  }

  importVariables() {
    let reader = new FileReader();
    reader.onload = this.handleVariablesFileUploadEvent.bind(this);
    FileImportHelper.importCriteria(this.variableFileElementId, reader, this.isUploadListenerNotAdded);
    this.isUploadListenerNotAdded = false;
  }

  handleVariablesFileUploadEvent(e) {
    let data = e.target['result'];
    this.file = FileImportHelper.getFile(this.variableFileElementId);
    // file.type is empty for some browsers and Windows OS
    if (FileImportHelper.isJsonFile(this.file)) {
      let _json = JSON.parse(data);
      if (_json['names']) {
        this.variableService.importVariablesByNames(_json['names']);
      } else if (_json['paths']) {
        this.variableService.importVariablesByPaths(_json['paths']);
      } else {
        MessageHelper.alert('error', 'Invalid file content for variables import.');
        return;
      }
      MessageHelper.alert('info', 'Variables file upload successful!');
    } else {
      MessageHelper.alert('error', 'Invalid file format for variables import.');
      return;
    }
  }

  get allChecked(): boolean {
    return this.variableService.variables.every((v: Concept) => {
      return v.selected;
    });
  }

  set allChecked(value: boolean) {
    this.variableService.setVariableSelection(value);
  }

  get isExport(): boolean {
    return this.navbarService.isExport;
  }

  get checkAllText(): string {
    let numSelected = this.numberOfSelected;
    return numSelected === 1 ?
      `${numSelected} variable selected` : `${numSelected} variables selected`;
  }

  get numberOfSelected(): number {
    return this.variableService.numSelectedVariables;
  }

  get variablesTree(): GbTreeNode[] {
    return this.variableService.variablesTree;
  }

  get categorizedVariablesTree(): GbTreeNode[] {
    return this.variableService.categorizedVariablesTree;
  }

}
