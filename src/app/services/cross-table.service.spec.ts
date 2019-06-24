/**
 * Copyright 2017 - 2019  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {TestBed, inject} from '@angular/core/testing';
import {CrossTableService} from './cross-table.service';
import {ResourceService} from './resource.service';
import {ResourceServiceMock} from './mocks/resource.service.mock';
import {TrueConstraint} from '../models/constraint-models/true-constraint';
import {ConceptConstraint} from '../models/constraint-models/concept-constraint';
import {Concept} from '../models/constraint-models/concept';
import {ConceptType} from '../models/constraint-models/concept-type';
import {CombinationConstraint} from '../models/constraint-models/combination-constraint';
import {CombinationState} from '../models/constraint-models/combination-state';
import {ConstraintService} from './constraint.service';
import {ConstraintServiceMock} from './mocks/constraint.service.mock';

describe('CrossTableService', () => {
  let crossTableService: CrossTableService;
  let resourceService: ResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ResourceService,
          useClass: ResourceServiceMock
        },
        {
          provide: ConstraintService,
          useClass: ConstraintServiceMock
        },
        CrossTableService
      ]
    });
    crossTableService = TestBed.get(CrossTableService);
    resourceService = TestBed.get(ResourceService);
  });

  it('should be created',
    inject([CrossTableService], (service: CrossTableService) => {
      expect(service).toBeTruthy();
    }));

  it('should check if a constraint is valid for cross table', () => {
    let categoricalConcept = new ConceptConstraint();
    let concept = new Concept();
    concept.type = ConceptType.CATEGORICAL;
    categoricalConcept.concept = concept;
    let combi = new CombinationConstraint();
    combi.addChild(categoricalConcept);
    combi.addChild(new TrueConstraint());
    let spy1 = spyOn(crossTableService, 'isValidConstraint').and.callThrough();
    let result = crossTableService.isValidConstraint(combi);
    expect(spy1).toHaveBeenCalled();
    expect(result).toBe(true);
    result = crossTableService.isValidConstraint(new TrueConstraint());
    expect(result).toBe(false);

    combi.addChild(categoricalConcept);
    result = crossTableService.isValidConstraint(combi);
    expect(result).toBe(false);

    combi.combinationState = CombinationState.Or;
    result = crossTableService.isValidConstraint(combi);
    expect(result).toBe(false);
  });

  it('should get and set selectedConstraintCell', () => {
    let spyGet =
      spyOnProperty(crossTableService, 'selectedConstraintCell', 'get').and.callThrough();
    let spySet =
      spyOnProperty(crossTableService, 'selectedConstraintCell', 'set').and.callThrough();
    crossTableService.selectedConstraintCell = null;
    expect(crossTableService.selectedConstraintCell).toBe(null);
    expect(spyGet).toHaveBeenCalled();
    expect(spySet).toHaveBeenCalled();
  });

});
