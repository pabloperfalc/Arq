import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram-editor',
  templateUrl: './diagram-editor.component.html',
  styleUrls: ['./diagram-editor.component.css']
})
export class DiagramEditorComponent implements OnInit {
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
    this.diagram.allowDrop = true;  // necessary for dragging from Palette
    this.diagram.undoManager.isEnabled = true;
    this.diagram.addDiagramListener("ChangedSelection",
        e => {
          const node = e.diagram.selection.first();
          this.nodeSelected.emit(node instanceof go.Node ? node : null);
        });
    this.diagram.addModelChangedListener(e => e.isTransactionFinished && this.modelChanged.emit(e));

    // this.diagram.nodeTemplate =
    //   $(go.Node, "Auto",
    //     new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    //     $(go.Shape,
    //       {
    //         fill: "white", strokeWidth: 0,
    //         portId: "", cursor: "pointer",
    //         // allow many kinds of links
    //         fromLinkable: true, toLinkable: true,
    //         fromLinkableSelfNode: true, toLinkableSelfNode: true,
    //         fromLinkableDuplicates: true, toLinkableDuplicates: true
    //       },
    //       new go.Binding("fill", "color")),
    //     $(go.TextBlock,
    //       { margin: 8, editable: true },
    //       new go.Binding("text").makeTwoWay())
    //   );

      this.diagram.linkTemplate =
      $(go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 3,
          relinkableFrom: true, relinkableTo: true,
          selectionAdorned: false, // Links are not adorned when selected so that their color remains visible.
          shadowOffset: new go.Point(0, 0), shadowBlur: 5, shadowColor: "blue",
        },
        new go.Binding("isShadowed", "isSelected").ofObject(),
        $(go.Shape,
          { name: "SHAPE", strokeWidth: 2, stroke: "red" }));



      function nodeStyle() {
        return [new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("isShadowed", "isSelected").ofObject(),
                {
                  selectionAdorned: false,
                  shadowOffset: new go.Point(0, 0),
                  shadowBlur: 15,
                  shadowColor: "blue",
                }];
      }

      function shapeStyle() {
        return {
          name: "NODESHAPE",
          fill: "lightgray",
          stroke: "darkslategray",
          desiredSize: new go.Size(40, 40),
          strokeWidth: 2
        };
      }

      function portStyle(input) {
        return {
          desiredSize: new go.Size(6, 6),
          fill: "black",
          fromSpot: go.Spot.Right,
          fromLinkable: !input,
          toSpot: go.Spot.Left,
          toLinkable: input,
          toMaxLinks: 1,
          cursor: "pointer"
        };
      }

      var dTemplate =
      $(go.Node, "Spot", nodeStyle(),
        $(go.Shape, "Rectangle", shapeStyle(),{ desiredSize: new go.Size(100, 100),} ),
        $(go.Shape, "Rectangle", portStyle(true),
          { portId: "in", alignment: new go.Spot(0, 0.3) }),
        $(go.Shape, "Rectangle", portStyle(true),
          { portId: "clock", alignment: new go.Spot(0, 0.7) }),
        $(go.Shape, "Rectangle", portStyle(false),
          { portId: "out", alignment: new go.Spot(1, 0.3) }),
        $(go.Shape, "Rectangle", portStyle(false),
          { portId: "nout", alignment: new go.Spot(1, 0.7) }),
        $(go.TextBlock,
          { margin: 8, editable: false, font:"small-caps bold 32px Georgia, Serif" },new go.Binding("text").makeTwoWay()),
        $(go.TextBlock,
          { margin: 8, alignment: new go.Spot(0.1, 0.3), editable: false, font:"small-caps bold 12px Georgia, Serif" },"D"),
        $(go.TextBlock,
            { margin: 8, alignment: new go.Spot(0.9, 0.3), editable: false, font:"small-caps bold 12px Georgia, Serif" },"Q"),
        $(go.TextBlock,
          { margin: 8, alignment: new go.Spot(0.18, 0.7), editable: false, font:"small-caps bold 12px Georgia, Serif" },"CLK"),
        $(go.TextBlock,
          { margin: 8, alignment: new go.Spot(0.85, 0.7), editable: false, font:"small-caps bold 12px Georgia, Serif" },"QN")
      );



           // define templates for each type of node
        var inputTemplate =
            $(go.Node, "Spot", nodeStyle(),
              $(go.Shape, "Rectangle", shapeStyle(),
               { fill: "red", desiredSize: new go.Size(20, 10) }),  // override the default fill (from shapeStyle()) to be red
              $(go.Shape, "Rectangle", portStyle(false),  // the only port
                { portId: "", alignment: new go.Spot(1, 0.5) }),
              $(go.TextBlock,
                { margin: 8, alignment: new go.Spot(0.5, -0.5), editable: true, font:"small-caps bold 12px Georgia, Serif" },
                new go.Binding("text").makeTwoWay())
           );
   
         var outputTemplate =
           $(go.Node, "Spot", nodeStyle(),
             $(go.Shape, "OffPageConnector", shapeStyle(),
               { fill: "green", desiredSize: new go.Size(20, 10) }),  // override the default fill (from shapeStyle()) to be green
             $(go.Shape, "Rectangle", portStyle(true),  // the only port
               { portId: "", alignment: new go.Spot(0, 0.5) }),
              $(go.TextBlock,
                { margin: 8, alignment: new go.Spot(0.5, -0.5), editable: true, font:"small-caps bold 12px Georgia, Serif" },
                new go.Binding("text").makeTwoWay())
           );
   
         var andTemplate =
           $(go.Node, "Spot", nodeStyle(),
             $(go.Shape, "AndGate", shapeStyle()),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in1", alignment: new go.Spot(0, 0.3) }),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in2", alignment: new go.Spot(0, 0.7) }),
             $(go.Shape, "Rectangle", portStyle(false),
               { portId: "out", alignment: new go.Spot(1, 0.5) })
           );

          
   
         var orTemplate =
           $(go.Node, "Spot", nodeStyle(),
             $(go.Shape, "OrGate", shapeStyle()),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
             $(go.Shape, "Rectangle", portStyle(false),
               { portId: "out", alignment: new go.Spot(1, 0.5) })
           );
   
         var xorTemplate =
           $(go.Node, "Spot", nodeStyle(),
             $(go.Shape, "XorGate", shapeStyle()),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
             $(go.Shape, "Rectangle", portStyle(false),
               { portId: "out", alignment: new go.Spot(1, 0.5) })
           );
   
         var norTemplate =
           $(go.Node, "Spot", nodeStyle(),
             $(go.Shape, "NorGate", shapeStyle()),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
             $(go.Shape, "Rectangle", portStyle(false),
               { portId: "out", alignment: new go.Spot(1, 0.5) })
           );
   
         var xnorTemplate =
           $(go.Node, "Spot", nodeStyle(),
             $(go.Shape, "XnorGate", shapeStyle()),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
             $(go.Shape, "Rectangle", portStyle(false),
               { portId: "out", alignment: new go.Spot(1, 0.5) })
           );
   
         var nandTemplate =
           $(go.Node, "Spot", nodeStyle(),
             $(go.Shape, "NandGate", shapeStyle()),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in1", alignment: new go.Spot(0, 0.3) }),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in2", alignment: new go.Spot(0, 0.7) }),
             $(go.Shape, "Rectangle", portStyle(false),
               { portId: "out", alignment: new go.Spot(1, 0.5) })
           );
   
         var notTemplate =
           $(go.Node, "Spot", nodeStyle(),
             $(go.Shape, "Inverter", shapeStyle()),
             $(go.Shape, "Rectangle", portStyle(true),
               { portId: "in", alignment: new go.Spot(0, 0.5) }),
             $(go.Shape, "Rectangle", portStyle(false),
               { portId: "out", alignment: new go.Spot(1, 0.5) })
           );
   
         // add the templates created above to myDiagram and palette
         this.diagram.nodeTemplateMap.add("input", inputTemplate);
         this.diagram.nodeTemplateMap.add("output", outputTemplate);
         this.diagram.nodeTemplateMap.add("and", andTemplate);
         this.diagram.nodeTemplateMap.add("or", orTemplate);
         this.diagram.nodeTemplateMap.add("xor", xorTemplate);
         this.diagram.nodeTemplateMap.add("not", notTemplate);
         this.diagram.nodeTemplateMap.add("nand", nandTemplate);
         this.diagram.nodeTemplateMap.add("nor", norTemplate);
         this.diagram.nodeTemplateMap.add("xnor", xnorTemplate);
         this.diagram.nodeTemplateMap.add("flipflop", dTemplate);


  }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
  }
}
