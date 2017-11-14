import { Component, ViewChild, ElementRef } from '@angular/core';
import * as go from 'gojs';
import { SelectItem } from 'primeng/components/common/selectitem';
import { StateChange } from './StateChange';
import { debug } from 'util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My First GoJS App in Angular';
  
  public model:go.GraphLinksModel;
  public displayDialog: boolean;

  public stateChange: StateChange = new StateChange();
  public newStateChange:boolean;
  public stateChanges:StateChange[];
  public states: SelectItem[];
  public inputs: SelectItem[];
  public outputs: SelectItem[];

  showDialogToAdd() {
    this.newStateChange = true;
    this.displayDialog = true;
    this.stateChange = new StateChange();
    this.stateChange.state = this.states[0].value;
    this.stateChange.input = this.inputs[0].value;
    this.stateChange.output = this.outputs[0].value;
    this.stateChange.nextState = this.states[0].value;
  }

  save() {
    let stateChanges = [...this.stateChanges];
    
    if(this.newStateChange){
      this.stateChange.stateBits = (this.states.findIndex( s => s.value == this.stateChange.state).toString(2).padStart(this.states.length,"0").split('').map(x => x === '1'));
      this.stateChange.inputBits = (this.inputs.findIndex( s => s.value == this.stateChange.input).toString(2).padStart(this.inputs.length,"0").split('').map(x => x === '1'));
      this.stateChange.nextStateBits = (this.states.findIndex( s => s.value == this.stateChange.nextState).toString(2).padStart(this.states.length,"0").split('').map(x => x === '1'));
      this.stateChange.outputBits = (this.outputs.findIndex( s => s.value == this.stateChange.output).toString(2).padStart(this.outputs.length,"0").split('').map(x => x === '1'));
      stateChanges.push(this.stateChange);
    }
    // else
      //this.stateChanges[this.findSelectedCarIndex()] = this.car;
    
    this.stateChanges = stateChanges;
    this.stateChange = null;
    this.displayDialog = false;
}
  
  
  ngOnInit() {
    this.stateChanges = [];
    this.states = [
      {label:'A', value:'A'},
      {label:'B', value:'B'},
      {label:'C', value:'C'},
      {label:'D', value:'D'},
    ];

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
