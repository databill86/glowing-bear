/**
 * Copyright 2017 - 2019  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {TestBed} from '@angular/core/testing';
import {ResourceService} from '../app/services/resource.service';
import {of as observableOf} from 'rxjs';
import {TransmartTableState} from '../app/models/transmart-models/transmart-table-state';
import {Constraint} from '../app/models/constraint-models/constraint';
import {DataTableService} from '../app/services/data-table.service';
import {ConstraintServiceMock} from '../app/services/mocks/constraint.service.mock';
import {ConstraintService} from '../app/services/constraint.service';
import {StudyService} from '../app/services/study.service';
import {AppConfig} from '../app/config/app.config';
import {AppConfigMock} from '../app/config/app.config.mock';
import {TransmartHttpService} from '../app/services/http/transmart-http.service';
import {TransmartHttpServiceMock} from '../app/services/mocks/transmart-http.service.mock';
import {TransmartResourceService} from '../app/services/transmart-resource.service';
import {TransmartPackerHttpService} from '../app/services/http/transmart-packer-http.service';
import Spy = jasmine.Spy;
import {TransmartPackerHttpServiceMock} from '../app/services/mocks/transmart-packer-http.service.mock';
import {GbBackendHttpService} from '../app/services/http/gb-backend-http.service';
import {GbBackendHttpServiceMock} from '../app/services/mocks/gb-backend-http.service.mock';
import {VariableService} from '../app/services/variable.service';
import {VariableServiceMock} from '../app/services/mocks/variable.service.mock';

const mockResponseData = {
  'columnDimensions': [{
    'elements': {
      'TNS:DEM:AGE': {
        'conceptCode': 'TNS:DEM:AGE',
        'conceptPath': '\\Public Studies\\TUMOR_NORMAL_SAMPLES\\Demography\\Age\\',
        'label': 'TNS:DEM:AGE',
        'name': 'Age'
      },
      'TNS:HD:EXPBREAST': {
        'conceptCode': 'TNS:HD:EXPBREAST',
        'conceptPath': '\\Public Studies\\TUMOR_NORMAL_SAMPLES\\HD\\Breast\\',
        'label': 'TNS:HD:EXPBREAST',
        'name': 'Breast'
      },
      'TNS:HD:EXPLUNG': {
        'conceptCode': 'TNS:HD:EXPLUNG',
        'conceptPath': '\\Public Studies\\TUMOR_NORMAL_SAMPLES\\HD\\Lung\\',
        'label': 'TNS:HD:EXPLUNG',
        'name': 'Lung'
      },
      'TNS:LAB:CELLCNT': {
        'conceptCode': 'TNS:LAB:CELLCNT',
        'conceptPath': '\\Public Studies\\TUMOR_NORMAL_SAMPLES\\Lab\\Cell Count\\',
        'label': 'TNS:LAB:CELLCNT',
        'name': 'Cell Count'
      }
    },
    'name': 'concept'
  }, {
    'name': 'sample_type'
  }],
  'columnHeaders': [{
    'dimension': 'concept',
    'keys': ['TNS:DEM:AGE', 'TNS:HD:EXPBREAST', 'TNS:HD:EXPBREAST', 'TNS:HD:EXPLUNG', 'TNS:HD:EXPLUNG',
      'TNS:LAB:CELLCNT', 'TNS:LAB:CELLCNT']
  }, {
    'dimension': 'sample_type',
    'elements': [null, 'Normal', 'Tumor', 'Normal', 'Tumor', 'Normal', 'Tumor']
  }],
  'offset': 0,
  'rowCount': 3,
  'rowDimensions': [{
    'elements': {
      '-43/TNS:43': {
        'age': 52,
        'birthDate': null,
        'deathDate': null,
        'id': -43,
        'inTrialId': '3',
        'label': '-43/TNS:43',
        'maritalStatus': null,
        'race': 'Caucasian',
        'religion': null,
        'sex': 'female',
        'sexCd': 'Female',
        'subjectIds': {
          'SUBJ_ID': 'TNS:43'
        },
        'trial': 'TUMOR_NORMAL_SAMPLES'
      },
      '-53/TNS:53': {
        'age': 42,
        'birthDate': null,
        'deathDate': null,
        'id': -53,
        'inTrialId': '2',
        'label': '-53/TNS:53',
        'maritalStatus': null,
        'race': 'Latino',
        'religion': null,
        'sex': 'male',
        'sexCd': 'Male',
        'subjectIds': {
          'SUBJ_ID': 'TNS:53'
        },
        'trial': 'TUMOR_NORMAL_SAMPLES'
      },
      '-63/TNS:63': {
        'age': 40,
        'birthDate': null,
        'deathDate': null,
        'id': -63,
        'inTrialId': '1',
        'label': '-63/TNS:63',
        'maritalStatus': null,
        'race': 'Caucasian',
        'religion': null,
        'sex': 'male',
        'sexCd': 'Male',
        'subjectIds': {
          'SUBJ_ID': 'TNS:63'
        },
        'trial': 'TUMOR_NORMAL_SAMPLES'
      }
    },
    'name': 'patient'
  }],
  'rows': [{
    'cells': [40, null, 'sample3', 'sample1', 'sample2', 203, 100],
    'rowHeaders': [{
      'dimension': 'patient',
      'key': '-63/TNS:63'
    }]
  }, {
    'cells': [42, null, 'sample5', null, 'sample4', 180, 80],
    'rowHeaders': [{
      'dimension': 'patient',
      'key': '-53/TNS:53'
    }]
  }, {
    'cells': [52, 'sample9', null, ['sample7', 'sample8'], 'sample6', [380, 240], 28],
    'rowHeaders': [{
      'dimension': 'patient',
      'key': '-43/TNS:43'
    }]
  }],
  'sort': [{
    'dimension': 'patient',
    'sortOrder': 'asc'
  }, {
    'dimension': 'concept',
    'sortOrder': 'asc'
  }]
};

/**
 * Test suite that tests the data table functionality, by calling
 * functions on the data table service (which holds the data table data structure),
 * and checking if the expected calls are being made to the tranSMART resource service.
 */
describe('Integration test data table retrieval calls for TranSMART', () => {
  let dataTableService: DataTableService;
  let resourceService: ResourceService;
  let transmartResourceService: TransmartResourceService;
  let transmartHttpService: TransmartHttpService;
  let dataTableCall: Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TransmartHttpService,
          useClass: TransmartHttpServiceMock
        },
        {
          provide: TransmartPackerHttpService,
          useClass: TransmartPackerHttpServiceMock
        },
        {
          provide: GbBackendHttpService,
          useClass: GbBackendHttpServiceMock
        },
        {
          provide: ConstraintService,
          useClass: ConstraintServiceMock
        },
        {
          provide: VariableService,
          useClass: VariableServiceMock
        },
        {
          provide: AppConfig,
          useClass: AppConfigMock
        },
        ResourceService,
        TransmartResourceService,
        StudyService,
        DataTableService
      ]
    });
    resourceService = TestBed.get(ResourceService);
    transmartHttpService = TestBed.get(TransmartHttpService);
    transmartResourceService = TestBed.get(TransmartResourceService);
    dataTableService = TestBed.get(DataTableService);
  });

  it('should load data table data on initialisation', () => {
    dataTableCall = spyOn(transmartHttpService, 'getDataTable')
      .and.callFake((tableState: TransmartTableState,
                     constraint: Constraint,
                     offset: number, limit: number) => {
        return observableOf(mockResponseData);
      });
    let studyIdsCall = spyOn(transmartHttpService, 'getStudyIds')
      .and.callFake((constraint: Constraint) => {
        return observableOf(['s1', 's2'])
      });

    dataTableService.updateDataTable();

    /**
     * After the studies have been loaded, and the data table service has been initialised ...
     * The sequence of calls goes as follows:
     * variable.service:variablesUpdated ->
     * data-table.service:updateDataTable ->
     * resource.service:getDataTable ->
     * transmart-resource.service:getDataTable ->
     * transmart-resource.service:getDimensions ->
     * transmart-resource.service:getStudyIds ->
     * transmart-http.service:getStudyIds
     */
    resourceService.getStudies().subscribe(() => {

      // the table should be updated.
      expect(studyIdsCall).toHaveBeenCalled();
      expect(dataTableCall).toHaveBeenCalled();
      expect(dataTableService.rows.length).toEqual(5);
    });
  });

});
