import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram-editorStateMachine',
  templateUrl: './diagram-editor.component.html',
  styleUrls: ['./diagram-editor.component.css']
})
export class DiagramEditorStateMachineComponent implements OnInit {
  private diagram: go.Diagram = new go.Diagram();

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  @Input()
  get model(): go.Model { return this.diagram.model; }
  set model(val: go.Model) { this.diagram.model = val; }

  @Output()
  nodeSelected = new EventEmitter<go.Node|null>();

  @Output()
  modelChanged = new EventEmitter<go.ChangedEvent>();

  constructor() {
    const $ = go.GraphObject.make;
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowLink = false;
   
    this.diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      // define the node's outer shape, which will surround the TextBlock
      $(go.Shape, "RoundedRectangle",
        {
          parameter1: 20,  // the corner has a large radius
          fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
          stroke: null,
          portId: "",  // this Shape is the Node's port, not the whole Node
          fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
          toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
          cursor: "pointer"
        }),
      $(go.TextBlock,
        {
          font: "bold 11pt helvetica, bold arial, sans-serif",
          editable: true  // editing the text automatically updates the model data
        },
        new go.Binding("text").makeTwoWay())
    );

    // unlike the normal selection Adornment, this one includes a Button
    this.diagram.nodeTemplate.selectionAdornmentTemplate =
    $(go.Adornment, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, { fill: null, stroke: "blue", strokeWidth: 2 }),
        $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
      ),
      // the button to create a "next" node, at the top-right corner
    ); // end Adornment

     // replace the default Link template in the linkTemplateMap
     this.diagram.linkTemplate =
     $(go.Link,  // the whole link panel
       {
         curve: go.Link.Bezier, adjusting: go.Link.Stretch,
         reshapable: true, relinkableFrom: false, relinkableTo: false,
         toShortLength: 3
       },
       new go.Binding("points").makeTwoWay(),
       new go.Binding("curviness"),
       $(go.Shape,  // the link shape
         { strokeWidth: 1.5 }),
       $(go.Shape,  // the arrowhead
         { toArrow: "standard", stroke: null }),
       $(go.Panel, "Auto",
         $(go.Shape,  // the label background, which becomes transparent around the edges
           {
             fill: $(go.Brush, "Radial",
                     { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
             stroke: null
           }),
         $(go.TextBlock, "transition",  // the label text
           {
             textAlign: "center",
             font: "9pt helvetica, arial, sans-serif",
             margin: 4,
             editable: true  // enable in-place editing
           },
           // editing the text automatically updates the model data
           new go.Binding("text").makeTwoWay())
       )
     );

  }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
  }
}
