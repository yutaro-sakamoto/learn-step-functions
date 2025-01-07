interface LambdaResponse {
  status: "SUCCESS" | "FAILURE";
}

exports.handler = async (event: {}): Promise<LambdaResponse> => {
  const result: LambdaResponse = {
    status: "SUCCESS",
  };
  return result;
};
