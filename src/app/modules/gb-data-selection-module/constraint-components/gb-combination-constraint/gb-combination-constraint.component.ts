/**
 * Copyright 2017 - 2018  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {GbConstraintComponent} from '../gb-constraint/gb-constraint.component';
import {CombinationConstraint} from '../../../../models/constraint-models/combination-constraint';
import {Constraint} from '../../../../models/constraint-models/constraint';
import {AutoComplete} from 'primeng/components/autocomplete/autocomplete';
import {CombinationState} from '../../../../models/constraint-models/combination-state';
import {PedigreeConstraint} from '../../../../models/constraint-models/pedigree-constraint';
import {TreeNode} from '../../../../models/tree-models/tree-node';

@Component({
  selector: 'gb-combination-constraint',
  templateUrl: './gb-combination-constraint.component.html',
  styleUrls: ['./gb-combination-constraint.component.css', '../gb-constraint/gb-constraint.component.css']
})
export class GbCombinationConstraintComponent extends GbConstraintComponent implements OnInit {
  CombinationState = CombinationState;

  @ViewChild('autoComplete') autoComplete: AutoComplete;

  searchResults: Constraint[];
  selectedConstraint: Constraint;

  ngOnInit() {
  }

  get isAnd(): boolean {
    return (<CombinationConstraint>this.constraint).isAnd();
  }

  get children(): Constraint[] {
    return (<CombinationConstraint>this.constraint).children;
  }

  /**
   * Removes the childConstraint from the CombinationConstraint corresponding to this component.
   * @param childConstraint
   */
  onConstraintRemoved(childConstraint: Constraint) {
    (<CombinationConstraint>this.constraint).removeChildConstraint(childConstraint);
    this.update();
  }

  onSearch(event) {
    let results = this.constraintService.searchAllConstraints(event.query);
    this.searchResults = results;
  }

  onDropdown(event) {
    let results = this.constraintService.searchAllConstraints('');

    // Workaround for dropdown not showing properly, as described in
    // https://github.com/primefaces/primeng/issues/745
    this.searchResults = [];
    this.searchResults = results;
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    if (this.autoComplete.panelVisible) {
      this.autoComplete.hide();
    } else {
      this.autoComplete.show();
    }
  }

  onSelect(selectedConstraint) {
    if (selectedConstraint != null) {

      // Create a copy of the selected constraint
      let newConstraint: Constraint = new selectedConstraint.constructor();
      Object.assign(newConstraint, this.selectedConstraint);

      if (newConstraint.className === 'CombinationConstraint') {
        // we don't want to copy a CombinationConstraint's children
        (<CombinationConstraint>newConstraint).children = [];
      } else if (newConstraint.className === 'PedigreeConstraint') {
        // we don't want to copy a PedigreeConstraint's right-hand-side constraint
        (<PedigreeConstraint>newConstraint).rightHandSideConstraint = new CombinationConstraint();
      }

      // Add it as a new child
      let combinationConstraint: CombinationConstraint = <CombinationConstraint>this.constraint;
      combinationConstraint.addChild(newConstraint);

      // force combination state if i2b2 style nesting
      let parentConstraint = this.constraint.parent as CombinationConstraint;
      if (this.config.getConfig('force-i2b2-nesting-style', false) &&
        parentConstraint && parentConstraint.isRoot) {
        (<CombinationConstraint>this.constraint).combinationState = CombinationState.Or;
      }
      this.update();

      // Clear selection (for some reason, setting the model selectedConstraint
      // to null doesn't work)
      this.autoComplete.selectItem(null);
      this.update();
    }
  }

  onDrop(event) {
    event.stopPropagation();
    let selectedNode: TreeNode = this.treeNodeService.selectedTreeNode;
    this.droppedConstraint =
      this.constraintService.generateConstraintFromTreeNode(selectedNode, selectedNode ? selectedNode.dropMode : null);
    this.treeNodeService.selectedTreeNode = null;
    if (this.droppedConstraint) {
      let combinationConstraint: CombinationConstraint = <CombinationConstraint>this.constraint;
      combinationConstraint.addChild(this.droppedConstraint);

      // force combination state if free nesting not supported
      let parentConstraint = this.constraint.parent as CombinationConstraint;
      if (this.config.getConfig('force-i2b2-nesting-style', false) &&
        parentConstraint && parentConstraint.isRoot) {
        combinationConstraint.combinationState = CombinationState.Or;
      }

      this.update();
      this.droppedConstraint = null;
    }
  }

  get combinationState() {
    return (<CombinationConstraint>this.constraint).combinationState;
  }

  toggleJunction() {
    if (!this.config.getConfig('force-i2b2-nesting-style', false)) {
      (<CombinationConstraint>this.constraint).switchCombinationState();
      this.update();
    }
  }

  get childContainerClass(): string {
    return (<CombinationConstraint>this.constraint).isRoot ?
      '' : 'gb-combination-constraint-child-container';
  }

  addChildCombinationConstraint() {
    (<CombinationConstraint>this.constraint).addChild(new CombinationConstraint());
  }

  // todo: check behavior of allowGroupChildren if we get pedigree or something similar
  allowGroupChildren(): boolean {
    if (!(this.constraint instanceof CombinationConstraint)) {
      return false;
    }

    if (!this.config.getConfig('force-i2b2-nesting-style', false)) {
      return true;
    } else {
      return this.constraint.isRoot;
    }
  }
}
