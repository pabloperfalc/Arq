export class StateChange{
    id:string;
    state:String;
    nextState:String;
    input:String;
    output:String;
    stateBits:string[];//boolean[];
    nextStateBits:string[];//boolean[];
    inputBits:string[];//boolean[];
    outputBits:string[];//boolean[];
}