interface StepFunctionEvent {
  // Define the structure of the event if needed
  key: string;
  value: string;
}

interface LambdaResponse {
  status: "SUCCESS" | "FAILURE";
}

exports.handler = async (event: StepFunctionEvent): Promise<LambdaResponse> => {
  console.log("key:", event.key);
  console.log("value:", event.value);

  return { status: "SUCCESS" };
};
