/**
 * Copyright 2017 - 2019  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {DataTableService} from '../app/services/data-table.service';
import {TreeNodeService} from '../app/services/tree-node.service';
import {ExportService} from '../app/services/export.service';
import {CrossTableService} from '../app/services/cross-table.service';
import {TestBed} from '@angular/core/testing';
import {NavbarService} from '../app/services/navbar.service';
import {ConstraintService} from '../app/services/constraint.service';
import {ResourceServiceMock} from '../app/services/mocks/resource.service.mock';
import {CohortService} from '../app/services/cohort.service';
import {ResourceService} from '../app/services/resource.service';
import {DatePipe} from '@angular/common';
import {ExportJob} from '../app/models/export-models/export-job';
import {StudyService} from '../app/services/study.service';
import {AuthenticationService} from '../app/services/authentication/authentication.service';
import {AuthenticationServiceMock} from '../app/services/mocks/authentication.service.mock';
import {AppConfigMock} from '../app/config/app.config.mock';
import {AppConfig} from '../app/config/app.config';
import {VariableService} from '../app/services/variable.service';

describe('Integration test for data export', () => {

  let resourceService: ResourceService;
  let exportService: ExportService;
  let cohortService: CohortService;
  let treeNodeService: TreeNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AppConfig,
          useClass: AppConfigMock
        },
        {
          provide: ResourceService,
          useClass: ResourceServiceMock
        },
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceMock
        },
        TreeNodeService,
        VariableService,
        ConstraintService,
        DataTableService,
        CrossTableService,
        ExportService,
        StudyService,
        CohortService,
        NavbarService,
        DatePipe
      ]
    });
    resourceService = TestBed.get(ResourceService);
    exportService = TestBed.get(ExportService);
    cohortService = TestBed.get(CohortService);
    treeNodeService = TestBed.get(TreeNodeService);
  });

  it('should create and update an export job', () => {
    // TODO: rewrite this test according to the new export job update workflow
    // exportService.exportJobs = null;
    // let newExportJob = new ExportJob();
    // newExportJob.id = 'id1';
    // newExportJob.name = 'test job name 1';
    // exportService.exportJobName = 'test export name 1';
    // let spyCreate = spyOn(resourceService, 'prepareExportJob').and.callThrough();
    // let spyRun = spyOn(resourceService, 'runExportJob').and.callThrough();
    // let spyGet = spyOn(resourceService, 'getExportJobs').and.callThrough();
    // queryService.counts_2.subjectCount = 1;
    // queryService.counts_2.observationCount = 1;
    // treeNodeService.finalTreeNodes = [{}];
    // exportService.prepareExportJob()
    //   .then(() => {
    //     expect(spyCreate).toHaveBeenCalled();
    //     expect(spyRun).toHaveBeenCalled();
    //     expect(spyGet).toHaveBeenCalled();
    //     expect(exportService.exportJobs).toBeDefined();
    //     expect(exportService.exportJobs.length).toBe(1);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     fail('should have created and updated the export job but failed to do so.');
    //   });
  });

});
