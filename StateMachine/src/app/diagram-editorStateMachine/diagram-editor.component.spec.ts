import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramEditorStateMachineComponent } from './diagram-editor.component';

describe('DiagramEditorComponent', () => {
  let component: DiagramEditorStateMachineComponent;
  let fixture: ComponentFixture<DiagramEditorStateMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramEditorStateMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramEditorStateMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
