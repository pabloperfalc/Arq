import { Component, ViewChild, ElementRef } from '@angular/core';
import * as go from 'gojs';
import { SelectItem } from 'primeng/components/common/selectitem';
import { StateChange } from './StateChange';
import { debug } from 'util';
import { State } from './State';
import { Input } from './Input';
import { Output } from './Output';
import { Formula } from './Formula';
import { Text } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Maquinas de estado';

//outputs

public displayDialogOutput: boolean;
public output: Output = new Output();
public newOutput:boolean;
public selectedOutput:Output;
public outputs: Output[];

showDialogToAddOutput() {
  this.newOutput = true;
  this.displayDialogOutput = true;
  this.output = new Output();
}

saveOutput() {
  let outputs = [...this.outputs];
  if(this.newOutput){
    this.output.label = this.output.value;
    outputs.push(this.output);
  }
  else
  {
    this.output.label = this.output.value;
    outputs[this.findSelectedOutputIndex()] = this.output;
  }

  this.outputs = outputs;
  this.output = null;
  this.displayDialogOutput = false;
}

findSelectedOutputIndex(): number {
  return this.outputs.indexOf(this.selectedOutput);
}

deleteOutput() {
  let index = this.findSelectedOutputIndex();
  this.outputs = this.outputs.filter((val,i) => i!=index);
  this.output = null;
  this.displayDialogOutput = false;
}  

onRowSelectOutput(event) {
  this.newOutput = false;
  this.output = this.cloneOutput(event.data);
  this.displayDialogOutput = true;
}

cloneOutput(c: Output): Output {
  let output = new Output();
  for(let prop in c) {
    output[prop] = c[prop];
  }
  return output;
}
// Outputs



  //Inputs
  public displayDialogInput: boolean;
  public input: Input = new Input();
  public newInput:boolean;
  public selectedInput:Input;
  public inputs: Input[];

  showDialogToAddInput() {
    this.newInput = true;
    this.displayDialogInput = true;
    this.input = new Input();
  }

  saveInput() {
    let inputs = [...this.inputs];
    if(this.newInput){
      this.input.label = this.input.value;
      inputs.push(this.input);
    }
    else
    {
      this.input.label = this.input.value;
      inputs[this.findSelectedInputIndex()] = this.input;
    }

    this.inputs = inputs;
    this.input = null;
    this.displayDialogInput = false;
  }

  findSelectedInputIndex(): number {
    return this.inputs.indexOf(this.selectedInput);
  }

  deleteInput() {
    let index = this.findSelectedInputIndex();
    this.inputs = this.inputs.filter((val,i) => i!=index);
    this.input = null;
    this.displayDialogInput = false;
  }  

  onRowSelectInput(event) {
    this.newInput = false;
    this.input = this.cloneInput(event.data);
    this.displayDialogInput = true;
  }
  
  cloneInput(c: Input): Input {
    let input = new Input();
    for(let prop in c) {
      input[prop] = c[prop];
    }
    return input;
  }
  // Inputs

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
    
    let id = this.states.findIndex( s => s.value == this.stateChange.state).toString() + this.inputs.findIndex( s => s.value == this.stateChange.input).toString()
    if(this.stateChanges.findIndex(scs => scs.id == id) >= 0)
    {
      alert("Cambio de estado repetido") ;
      return;
    }

    if(this.newStateChange){
      this.stateChange.id = this.states.findIndex( s => s.value == this.stateChange.state).toString() + this.inputs.findIndex( s => s.value == this.stateChange.input).toString();
      this.stateChange.stateBits = (this.states.findIndex( s => s.value == this.stateChange.state).toString(2).padStart(this.stateBits.length,"0").split(''));//.map(x => x === '1'));
      this.stateChange.inputBits = (this.inputs.findIndex( s => s.value == this.stateChange.input).toString(2).padStart(this.inputBits.length,"0").split(''));//.map(x => x === '1'));
      this.stateChange.nextStateBits = (this.states.findIndex( s => s.value == this.stateChange.nextState).toString(2).padStart(this.stateBits.length,"0").split(''));//.map(x => x === '1'));
      this.stateChange.outputBits = (this.outputs.findIndex( s => s.value == this.stateChange.output).toString(2).padStart(this.outputBits.length,"0").split(''));//.map(x => x === '1'));
      stateChanges.push(this.stateChange);
    }
    else
    {
      stateChanges[this.findSelectedStateChangeIndex()] = this.stateChange;
    }

    this.stateChangesShow[this.stateChangesShow.findIndex(scs => scs.id == this.stateChange.id)] = this.stateChange;

    this.stateChanges = stateChanges;
    this.stateChange = null;
    this.displayDialogStateChange = false;

    
  }

  findSelectedStateChangeIndex(): number {
    return this.stateChanges.indexOf(this.selectedStateChange);
  }

  deleteStateChange() {
    let index = this.findSelectedStateChangeIndex();

    this.stateChangesShow[this.stateChangesShow.findIndex(scs => scs.id == this.stateChanges[index].id)].nextStateBits = "".padStart(this.stateBits.length,"X").split('');;
    this.stateChangesShow[this.stateChangesShow.findIndex(scs => scs.id == this.stateChanges[index].id)].outputBits = "".padStart(this.outputBits.length,"X").split('');;

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

  public inputBits:string[];
  public outputBits:string[];
  public stateBits:string[];

  public stateChangesShow: StateChange[];

  showStatesChangesInput(){
    this.showDataEntry = false;
    this.inputBits = (this.inputs.length - 1).toString(2).split('');
    this.outputBits = (this.outputs.length - 1).toString(2).split('');
    this.stateBits = (this.states.length - 1).toString(2).split('');
    this.stateChangesShow = [];
    for (var i = 0; i < 2**this.stateBits.length; i++)
    {
      for (var j = 0; j < 2**this.inputBits.length; j++)
      {
        let stateChange = new StateChange();
        stateChange.id = i.toString() + j.toString();
        stateChange.stateBits = i.toString(2).padStart(this.stateBits.length,"0").split('');
        stateChange.inputBits = j.toString(2).padStart(this.inputBits.length,"0").split('');
        stateChange.nextStateBits = "".padStart(this.stateBits.length,"X").split('');
        stateChange.outputBits = "".padStart(this.outputBits.length,"X").split('');
        this.stateChangesShow.push(stateChange);
      }
    }
   
  }

  public formulas:Formula[];
  public stringFormulas:string[];

  drawCircuit(){
    this.formulas = [];
    this.stringFormulas =[];

    for (var i = 0; i < this.outputBits.length; i++)
    {
      let formula = new Formula();
      formula.outPort = "S" + i;
      formula.data=[];
      this.formulas.push(formula);
    }
    for (var i = 0; i < this.stateBits.length; i++)
    {
      let formula = new Formula();
      formula.outPort = "D" + i;
      formula.data=[];
      this.formulas.push(formula);
    }

    for (let stateChange of this.stateChanges) {
      for (var i = 0; i < stateChange.outputBits.length; i++)
      {
        if(stateChange.outputBits[i] == "1"){
          let ands = [];
          for (var j = 0; j < stateChange.stateBits.length; j++)
          {
            if(stateChange.stateBits[j] == "1")
              ands.push("Q" + j);
            else
              ands.push("!Q" + j);
          }
          for (var j = 0; j < stateChange.inputBits.length; j++)
          {
            if(stateChange.inputBits[j] == "1")
              ands.push("E" + j);
            else
              ands.push("!E" + j);
          }
          this.formulas[i].data.push(ands);
        }
      }
      for (var i = 0; i < stateChange.nextStateBits.length; i++)
      {
        if(stateChange.nextStateBits[i] == "1"){
          let ands = [];
          for (var j = 0; j < stateChange.stateBits.length; j++)
          {
            if(stateChange.stateBits[j] == "1")
              ands.push("Q" + j);
            else
              ands.push("!Q" + j);
          }
          for (var j = 0; j < stateChange.inputBits.length; j++)
          {
            if(stateChange.inputBits[j] == "1")
              ands.push("E" + j);
            else
              ands.push("!E" + j);
          }
          this.formulas[stateChange.outputBits.length+i].data.push(ands);
        }
      }
    }
    this.stringFormulas = [];
    for (var i = 0; i < this.formulas.length; i++){
      let formula = this.formulas[i];
      this.stringFormulas[i]= formula.outPort + "= ";
      for (var j = 0; j < formula.data.length ; j++)
      {
        for (var k = 0; k < formula.data[j].length; k++)
        {
          this.stringFormulas[i] = this.stringFormulas[i] + formula.data[j][k] + ".";
        }
        this.stringFormulas[i] = this.stringFormulas[i].slice(0, -1);
        this.stringFormulas[i] = this.stringFormulas[i] + "+";
      }
      this.stringFormulas[i] = this.stringFormulas[i].slice(0, -1);
    }
  }


  drawStateMachine(){
    let nodeArray = [];
    let cont=0;
    
    for (let state of this.states) {
      nodeArray.push({ key: state.value, loc: (120 + (80 * cont)).toString() + " 120" , text: state.value })
      cont++;
    }

    let linkArray = [];

    for (let stateChange of this.stateChanges) {
      linkArray.push({ from: stateChange.state, to: stateChange.nextState, text: (stateChange.input + "/" + stateChange.output ), curviness: 70 })
    }

    this.modelStateMachine = new go.GraphLinksModel(nodeArray,linkArray);
    this.modelStateMachine.nodeDataArray

  }


  public model:go.GraphLinksModel;
  public showDataEntry:boolean;

  public modelStateMachine:go.GraphLinksModel;

  ngOnInit() {
    this.showDataEntry = true
    this.stateChanges = [];
    this.states = [
      {label:'Est1', value:'Est1'},
      {label:'Est2', value:'Est2'},
      {label:'Est3', value:'Est3'},
      {label:'Est4', value:'Est4'},
    ];
    this.inputs = [
      {label:'Ent1', value:'Ent1'},
      {label:'Ent2', value:'Ent2'},
    ];
    this.outputs = [
        {label:'Sal1', value:'Sal1'},
        {label:'Sal2', value:'Sal2'},
    ];

    this.modelStateMachine =new go.GraphLinksModel([],[]);
    // this.modelStateMachine = new go.GraphLinksModel([
    //     { key: 0, loc: "120 120", text: "Initial" },
    //     { key: 1, loc: "330 120", text: "First down" },
    //     { key: 2, loc: "226 376", text: "First up" },
    //     { key: 3, loc: "60 276", text: "Second down" },
    //     { key: 4, loc: "226 226", text: "Wait" }
    //   ],[
    //     { from: 0, to: 0, text: "up or timer", curviness: -20 },
    //     { from: 0, to: 1, text: "down", curviness: 20 },
    //     { from: 1, to: 0, text: "up (moved)\nPOST", curviness: 20 },
    //     { from: 1, to: 1, text: "down", curviness: -20 },
    //     { from: 1, to: 2, text: "up (no move)" },
    //     { from: 1, to: 4, text: "timer" },
    //     { from: 2, to: 0, text: "timer\nPOST" },
    //     { from: 2, to: 3, text: "down" },
    //     { from: 3, to: 0, text: "up\nPOST\n(dblclick\nif no move)" },
    //     { from: 3, to: 3, text: "down or timer", curviness: 20 },
    //     { from: 4, to: 0, text: "up\nPOST" },
    //     { from: 4, to: 4, text: "down" }
    //   ]
    //  );

     
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

      // console.log(this.formulas.length);
      var orS = 0;
      var orD = 0;
      var andS = 0;
      var andD = 0;
      var entradas = 0;
      console.log(this.formulas.length)
      for (var i = 0; i < this.formulas.length; i++) {
          for (var z = 0; z < this.formulas[i].data.length; z++) {
              console.log(this.formulas[i].data);
              //console.log(this.formulas[i])

              //        console.log(this.formulas[i].data[0])
              //      console.log(this.formulas[i].outPort[0])
              if (this.formulas[i].outPort[0] == "S") {
                  andS = andS + this.formulas[i].data[z].length - 1;
                  orS = this.formulas[i].data.length - 1;
              } else if (this.formulas[i].outPort[0] == "D") {
                  entradas = entradas + this.formulas[i].data[z].length;
                  andD = andD + this.formulas[i].data[z].length - 1;
                  orD = this.formulas[i].data.length - 1;

              }
          }
      }
      console.log(entradas);

      console.log(orD);
      console.log(orS);
      console.log(andD);
      console.log(andS);

      //console.log(and);
      var arr = [];
      //  console.log(this.inputBits.length);
      for (var _i = 0; _i < entradas; _i++) {
          arr.push({
              category: "input",
              key: ("E" + _i),
              loc: +"-500" + " " + (-500 + (_i * 30)).toString(),
              text: ("E" + _i)
          });
      }

      for (var _i = 0; _i < this.stateBits.length; _i++) {
          arr.push({
              category: "flipflop",
              key: ("D" + _i),
              loc: +"-200" + " " + (-500 + (_i * 150)).toString(),
              text: ("D" + _i)
          });
      }

      //for (var _i = 0; _i < this.stateBits.length; _i++) {
      arr.push({
          category: "input",
          key: ("C"),
          loc: +"-50" + " " + (-500 + (250)).toString(),
          text: ("CLK")
      });
      //}

      for (var _i = 0; _i < andD; _i++) {
          arr.push({
              category: "and",
              key: ("AD" + _i),
              loc: +"-400" + " " + (-350 + (_i * 50)).toString()
          });
      }

      for (var _i = 0; _i < andS; _i++) {
          arr.push({
              category: "and",
              key: ("AS" + _i),
              loc: +"100" + " " + (-350 + (_i * 50)).toString()
          });
      }


      for (var _i = 0; _i < orS; _i++) {
          arr.push({
              category: "or",
              key: ("ORS" + _i),
              loc: +"200" + " " + (-500 + (_i * 50)).toString()
          });
      }
      for (var _i = 0; _i < orD; _i++) {
        console.log('entro ord',)
          arr.push({
              category: "or",
              key: ("ORD" + _i),
              loc: +"-300" + " " + (-500 + (_i * 50)).toString()
          });
      }


      this.model.nodeDataArray = arr;
      //this.model.linkDataArray =[];
      var bandera = true;
      //this.stringFormulas = [];
      this.model.linkDataArray = [];
      for (var i = 0; i < this.formulas.length; i++) {
          let formula = this.formulas[i];
          console.log(formula);
          if (formula.data.length > 0) {
              for (var j = 0; j < formula.data.length; j++) {
                  console.log('formula.data[j].length;',formula.data[j].length);
                  for (var z = 0; z < (formula.data[j].length)/3; z++) {
                      console.log('aaa');

                      this.model.linkDataArray.push({
                          from: "E"+(z*3),
                          fromPort: "out",
                          to: "AD"+z,
                          toPort: "in1"
                      });
                      this.model.linkDataArray.push({
                          from: "E"+(z*3+1),
                          fromPort: "out",
                          to: "AD"+z,
                          toPort: "in2"
                      });
                      this.model.linkDataArray.push({
                          from: "E"+(z*3+2),
                          fromPort: "out",
                          to: "AD"+(z+1),
                          toPort: "in2"
                      });
                      this.model.linkDataArray.push({
                          from: "AD"+z,
                          fromPort: "out",
                          to: "AD"+(z+1),
                          toPort: "in1"
                      });



                      /*     this.model.linkDataArray = [
       {from:"E0", fromPort:"out", to:"AD0", toPort:"in1"},
     ];*/

                      //aca van los or
                  }

                  //{from:"input1", fromPort:"out", to:"and0", toPort:"in2"},
              }

              //  console.log(formula.data);


          }

      }
      //   console.log(this.model.linkDataArray)


      //this.model.linkDataArray = [
      //{from:"E0", fromPort:"out", to:"AD0", toPort:"in1"},
      //  {from:"E1", fromPort:"out", to:"AD0", toPort:"in2"},
      // {from:"input3", fromPort:"out", to:"and0", toPort:"in1"},
      // {from:"input4", fromPort:"out", to:"and1", toPort:"in2"},
      // {from:"and0", fromPort:"out", to:"or0", toPort:"in1"},
      // {from:"and1", fromPort:"out", to:"or0", toPort:"in2"},
      //];
      //console.log(this.model.linkDataArray)
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
