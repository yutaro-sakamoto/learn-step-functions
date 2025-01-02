import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";

export class FirstExample extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const startState = new sfn.Pass(this, "StartState");
    new sfn.StateMachine(this, "StateMachine", {
      definitionBody: sfn.DefinitionBody.fromChainable(startState),
    });
  }
}
