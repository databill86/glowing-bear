import {CombinationConstraint} from '../../models/constraint-models/combination-constraint';
import {Constraint} from '../../models/constraint-models/constraint';

export class ConstraintServiceMock {

  private _rootInclusionConstraint: CombinationConstraint;
  private _rootExclusionConstraint: CombinationConstraint;
  concepts = [];
  _constraint: Constraint = new CombinationConstraint();
  validPedigreeTypes = [];

  constructor() {
    this._rootInclusionConstraint = new CombinationConstraint();
    this._rootExclusionConstraint = new CombinationConstraint();
  }

  public depthOfConstraint(constraint: Constraint): number {
    return 1;
  }

  public constraint_1(): Constraint {
    return this._constraint;
  }

  public constraint_2(): Constraint {
    return this._constraint;
  }

  public generateInclusionConstraint(): Constraint {
    return this._constraint;
  }

  public hasExclusionConstraint(): Boolean {
    return false;
  }

  public constraint_1_2(): Constraint {
    return this._constraint;
  }

}
