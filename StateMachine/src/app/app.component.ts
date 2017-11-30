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
import { and, forEach } from '@angular/router/src/utils/collection';


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
    if(this.inputs.length > 0)
      this.inputBits = (this.inputs.length - 1).toString(2).split('');
    if(this.outputs.length > 0)
      this.outputBits = (this.outputs.length - 1).toString(2).split('');
    if(this.states.length > 0)
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

  showStatesInput(){
    this.showDataEntry = true;
    this.inputBits = [];
    this.outputBits = [];
    this.stateBits = [];
    this.stateChangesShow=[];
    this.stateChanges =[];
    this.stringFormulas=[];
    this.model.nodeDataArray = [];
    this.model.linkDataArray = [];
    this.modelStateMachine.nodeDataArray = [];
    this.modelStateMachine.linkDataArray = [];
    
  }

  public debug = false;
  showDebug(){
    if(this.debug)
      this.debug = false;
    else
      this.debug = true;
  }

  public formulas:Formula[];
  public stringFormulas:string[];

  drawSampleCircuit(){
     this.newStateChange = true;
     this.stateChange = new StateChange();
     this.stateChange.state = "Est1";
     this.stateChange.input = "Ent1";
     this.stateChange.nextState = "Est2";
     this.stateChange.output = "Sal2";
 
     this.saveStateChange();
 
     this.newStateChange = true;
     this.stateChange = new StateChange();
     this.stateChange.state = "Est2";
     this.stateChange.input = "Ent2";
     this.stateChange.nextState = "Est3";
     this.stateChange.output = "Sal2";
 
     this.saveStateChange();
 
     this.newStateChange = true;
     this.stateChange = new StateChange();
     this.stateChange.state = "Est3";
     this.stateChange.input = "Ent1";
     this.stateChange.nextState = "Est4";
     this.stateChange.output = "Sal1";
 
     this.saveStateChange();    
 
     this.newStateChange = true;
     this.stateChange = new StateChange();
     this.stateChange.state = "Est4";
     this.stateChange.input = "Ent2";
     this.stateChange.nextState = "Est1";
     this.stateChange.output = "Sal2";
 
     this.saveStateChange();
  }

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

    this.draw2();
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

    this.modelStateMachine = new go.GraphLinksModel([],[]);
    this.model = new go.GraphLinksModel([],[]);
    
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


  drawAndOrs(items:string[], outPort:string, posX:number, posY:number, nodeArr:any[], linkArr:any[],category:string ):string{
    debugger;
    var ands = [];
    var k = 1;
    var nextPosY = posY + 20;
    while( k < items.length){
      let item = items[k];
      let ant = items[k-1];
      let key = category+outPort+ant+item+(this.unique++).toString();
      nodeArr.push({
        category: category,
        key: key,
        loc: posX + " " + posY.toString(),
      });
      linkArr.push({
          from: this.getItem(ant),
          fromPort:  this.getOutPort(ant),
          to: key,
          toPort: "in1"
      });
      linkArr.push({
        from: this.getItem(item),
        fromPort: this.getOutPort(item),
        to: key,
        toPort: "in2"
      });
      ands.push(key);
      posY = posY + 80;
      k=k+2;
    }
    if(k==items.length){
      ands.push(items[k-1])
      
    }
    if(ands.length>1)
      return this.drawAndOrs(ands, outPort, posX+60, nextPosY, nodeArr,linkArr, category);
    else
      return ands[0];
  }

  getItem(item:string):string
  {
    debugger;
    let ret = item;
    if(item[0]=="Q") 
      ret = "D"+ret[1];
    else if (item[0]=="!" && item[1]=="Q")
      ret = "D"+ret[2];
    return ret;
  }

  getOutPort(item:string):string
  {
    debugger;
    if (item[0]=="!" && item[1]=="Q")
      return "nout";
    return "out"
  }

  findItem(inItem:string)
  {
    for(let formula of this.formulas) {
      for(let arr of formula.data){
        for(let item of arr){
          if(item == inItem)
          return true;
        }
      }
    }
    return false;
  }

  unique=0;

  draw2(){
    this.unique = 0;
    this.model.nodeDataArray = [];
    this.model.linkDataArray = [];
    var nodeArr = [];
    var linkArr = [];

    nodeArr.push({
      category: "input",
      key: "CLK",
      loc: "-500 -500",
      text: "CLK"
    });

    for (var _i = 0; _i < this.inputBits.length; _i++) {
      nodeArr.push({
          category: "input",
          key: ("E" + _i),
          loc: +"-500" + " " + (-460 + (_i * 40)).toString(),
          text: ("E" + _i)
      });
      if(this.findItem("!E" + _i))
      {
        nodeArr.push({
          category: "not",
          key: ("!E" + _i),
          loc: +"-450" + " " + (-440 + (_i * 40)).toString(),
        });

        linkArr.push({
          from: ("E" + _i),
          fromPort: "out",
          to: ("!E" + _i),
          toPort: "in"
        });
      }
    }

    for (var _i = 0; _i < this.inputBits.length; _i++) {
      nodeArr.push({
          category: "output",
          key: ("S" + _i),
          loc: +"400" + " " + (-500 + (_i * 100)).toString(),
          text: ("S" + _i)
      });
    }

    for (var _i = 0; _i < this.stateBits.length; _i++) {
      nodeArr.push({
            category: "flipflop",
            key: ("D" + _i),
            loc: +"-80" + " " + (-500 + (_i * 200)).toString(),
            text: ("D" + _i)
        });

        linkArr.push({
          from: "CLK",
          fromPort: "out",
          to: ("D" + _i),
          toPort: "clock"
        });
    }

    let posX= 0;
    let posYS = -500;
    let posYD = -500;
    for (var i = 0; i < this.formulas.length; i++) {
      let formula = this.formulas[i];
      
      if(formula.outPort[0]== "S"){
        posX = 100;
        let posyAnds = posYS;
        let ands = [];
        for (var j = 0; j < formula.data.length; j++){
          ands.push(this.drawAndOrs(formula.data[j], formula.outPort, posX, posyAnds, nodeArr, linkArr, "and"));
          posyAnds = posyAnds + 70;
        }
        var or = this.drawAndOrs(ands, formula.outPort, posX+150, posYS+50, nodeArr, linkArr, "or");
        linkArr.push({
          from: or,
          fromPort: "out",
          to: formula.outPort,
          toPort: "in"
        });

        posYS = posYS + 200;
      }
      else{
        posX = -350;
        let ands = [];
        let posyAnds = posYD;
        for (var j = 0; j < formula.data.length; j++){
         // formula.data[j].push("E2");
          ands.push(this.drawAndOrs(formula.data[j], formula.outPort, posX, posyAnds, nodeArr, linkArr, "and"));
          posyAnds = posyAnds + 70;
        }
        var or = this.drawAndOrs(ands, formula.outPort, posX+150, posYD+50, nodeArr, linkArr, "or");
        linkArr.push({
          from: or,
          fromPort: "out",
          to: formula.outPort,
          toPort: "in"
        });
        posYD =posYD + 200;
      }
    
    }


    this.model.nodeDataArray = nodeArr;
    this.model.linkDataArray = linkArr;
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
