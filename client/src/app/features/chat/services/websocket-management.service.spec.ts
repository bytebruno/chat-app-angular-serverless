import { TestBed } from '@angular/core/testing';

import { WebsocketManagementService } from './websocket-management.service';

describe('WebsocketManagementService', () => {
  let service: WebsocketManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
