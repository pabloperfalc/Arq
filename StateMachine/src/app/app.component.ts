import { Component, ViewChild, ElementRef } from '@angular/core';
import * as go from 'gojs';
import { SelectItem } from 'primeng/components/common/selectitem';
import { StateChange } from './StateChange';
import { debug } from 'util';
import { State } from './State';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Maquinas de estado';

  // States
  public displayDialogState: boolean;
  public state: State = new State();
  public newState:boolean;
  public selectedState:State;
  public states: SelectItem[];

  showDialogToAddState() {
    this.newState = true;
    this.displayDialogState = true;
    this.state = new State();
  }

  saveState() {

    debugger;
    let states = [...this.states];
    if(this.newState){
      this.state.label = this.state.value;
      states.push(this.state);
    }
    else
    {
      this.state.label = this.state.value;
      states[this.findSelectedStateIndex()] = this.state;
    }

    this.states = states;
    this.state = null;
    this.displayDialogState = false;
  }

  findSelectedStateIndex(): number {
    return this.states.indexOf(this.selectedState);
  }

  deleteState() {
    let index = this.findSelectedStateIndex();
    this.states = this.states.filter((val,i) => i!=index);
    this.state = null;
    this.displayDialogState = false;
  }  

  onRowSelectState(event) {
    this.newState = false;
    this.state = this.cloneState(event.data);
    this.displayDialogState = true;
  }
  
  cloneState(c: State): State {
    let state = new State();
    for(let prop in c) {
      state[prop] = c[prop];
    }
    return state;
  }
  // States



  // State Changes
  public displayDialogStateChange: boolean;
  public stateChange: StateChange = new StateChange();
  public newStateChange:boolean;
  public stateChanges:StateChange[];
  public selectedStateChange:StateChange;

  showDialogToAddStateChange() {
    this.newStateChange = true;
    this.displayDialogStateChange = true;
    this.stateChange = new StateChange();
    this.stateChange.state = this.states[0].value;
    this.stateChange.input = this.inputs[0].value;
    this.stateChange.output = this.outputs[0].value;
    this.stateChange.nextState = this.states[0].value;
  }

  saveStateChange() {
    let stateChanges = [...this.stateChanges];
    
    if(this.newStateChange){
      this.stateChange.stateBits = (this.states.findIndex( s => s.value == this.stateChange.state).toString(2).padStart(this.states.length,"0").split(''));//.map(x => x === '1'));
      this.stateChange.inputBits = (this.inputs.findIndex( s => s.value == this.stateChange.input).toString(2).padStart(this.inputs.length,"0").split(''));//.map(x => x === '1'));
      this.stateChange.nextStateBits = (this.states.findIndex( s => s.value == this.stateChange.nextState).toString(2).padStart(this.states.length,"0").split(''));//.map(x => x === '1'));
      this.stateChange.outputBits = (this.outputs.findIndex( s => s.value == this.stateChange.output).toString(2).padStart(this.outputs.length,"0").split(''));//.map(x => x === '1'));
      stateChanges.push(this.stateChange);
    }
    else
    {
      stateChanges[this.findSelectedStateChangeIndex()] = this.stateChange;
    }

    this.stateChanges = stateChanges;
    this.stateChange = null;
    this.displayDialogStateChange = false;
  }

  findSelectedStateChangeIndex(): number {
    return this.stateChanges.indexOf(this.selectedStateChange);
  }

  deleteStateChange() {
    let index = this.findSelectedStateChangeIndex();
    this.stateChanges = this.stateChanges.filter((val,i) => i!=index);
    this.stateChange = null;
    this.displayDialogStateChange = false;
  }  

  onRowSelect(event) {
    this.newStateChange = false;
    this.stateChange = this.cloneStateChange(event.data);
    this.displayDialogStateChange = true;
  }
  
  cloneStateChange(c: StateChange): StateChange {
    let stateChange = new StateChange();
    for(let prop in c) {
      stateChange[prop] = c[prop];
    }
    return stateChange;
  }
  // State Changes

  public model:go.GraphLinksModel;
  public inputs: SelectItem[];
  public outputs: SelectItem[];
  
  ngOnInit() {
    this.stateChanges = [];
    this.states = [];

    this.inputs = [
      {label:'A', value:'A'},
      {label:'B', value:'B'},
    ];

    this.outputs = [
      {label:'A', value:'A'},
      {label:'B', value:'B'},
    ];

    this.model = new go.GraphLinksModel(
    [
      {category:"input", key:"input1", loc:"-150 -80", text:"A" },
      {category:"or", key:"or1", loc:"-70 0" },
      {category:"not", key:"not1", loc:"10 0" },
      {category:"xor", key:"xor1", loc:"100 0" },
      {category:"or", key:"or2", loc:"200 0" },
      {category:"output", key:"output1",text:"sal", loc:"200 -100" },
      {category:"flipflop", text:"test", key:"flipflop", loc:"-200 -100" }
    ],
    [
      {from:"input1", fromPort:"out", to:"or1", toPort:"in1"},
      {from:"or1", fromPort:"out", to:"flipflop", toPort:"in"},
      {from:"not1", fromPort:"out", to:"or1", toPort:"in2"},
      {from:"not1", fromPort:"out", to:"xor1", toPort:"in1"},
      {from:"xor1", fromPort:"out", to:"or2", toPort:"in1"},
      {from:"or2", fromPort:"out", to:"xor1", toPort:"in2"},
      {from:"xor1", fromPort:"out", to:"output1", toPort:""}
    ]);
    this.model.linkFromPortIdProperty = "fromPort";
    this.model.linkToPortIdProperty = "toPort";
  }

  

  @ViewChild('text')
  private textField: ElementRef;

  data: any;
  node: go.Node;

  showDetails(node: go.Node | null) {
    this.node = node;
    if (node) {
      // copy the editable properties into a separate Object
      this.data = {
        text: node.data.text,
        color: node.data.color
      };
    } else {
      this.data = null;
    }
  }

  draw() {
    this.model.nodeDataArray = [];
    var arr = [];
    for (var _i = 0; _i < 10; _i++) {
      arr.push({category:"input", key:"input" + _i, loc: +"-500"+ " " + (-500 +(_i*30)).toString()});
    }

    for (var _i = 0; _i < 2; _i++) {
      arr.push({category:"and", key:"and" + _i, loc: +"-400"+ " " + (-500 +(_i*50)).toString()});
    }

    for (var _i = 0; _i < 1; _i++) {
      arr.push({category:"or", key:"or" + _i, loc: +"-300"+ " " + (-500 +(_i*50)).toString()});
    }


    this.model.nodeDataArray = arr;
    this.model.linkDataArray = [
    {from:"input1", fromPort:"out", to:"and0", toPort:"in2"},
    {from:"input2", fromPort:"out", to:"and1", toPort:"in1"},
    {from:"input3", fromPort:"out", to:"and0", toPort:"in1"},
    {from:"input4", fromPort:"out", to:"and1", toPort:"in2"},
    {from:"and0", fromPort:"out", to:"or0", toPort:"in1"},
    {from:"and1", fromPort:"out", to:"or0", toPort:"in2"},
    ];
  }

  onCommitDetails() {
    if (this.node) {
      const model = this.node.diagram.model;
      // copy the edited properties back into the node's model data,
      // all within a transaction
      model.startTransaction();
      model.setDataProperty(this.node.data, "text", this.data.text);
      model.setDataProperty(this.node.data, "color", this.data.color);
      model.commitTransaction("modified properties");
    }
  }

  onCancelChanges() {
    // wipe out anything the user may have entered
    this.showDetails(this.node);
  }

  onModelChanged(c: go.ChangedEvent) {
    // who knows what might have changed in the selected node and data?
    this.showDetails(this.node);
  }
}
