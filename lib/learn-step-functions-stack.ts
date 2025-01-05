import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { FirstExample } from "./FirstExample/first-example";
import { MapExample } from "./MapExample/map-example";

/**
 * Step Functions examples
 */

export class LearnStepFunctionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new FirstExample(this, "FirstExample");
    new MapExample(this, "MapExample");
  }
}
