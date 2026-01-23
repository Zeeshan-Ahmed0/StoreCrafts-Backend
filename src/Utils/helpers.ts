const sendSuccess = (
  res: any,
  data: any = {},
  message: string = "Success",
  status = 200
) => {
  return res.status(status).json({ success: true, message, data });
};

const sendError = (res: any, error: any, status = 500) => {
  const message =
    typeof error == "string" ? error : error.message || "Internal Server Error";
  console.log(message);
  return res.status(status).json({ success: false, message, status });
};

export { sendSuccess, sendError };
