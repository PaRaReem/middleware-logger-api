import AsyncStorage from "../../../middleware/AsyncStorage.Middleware";

function getCallerInfo() {
  const error = new Error();
  const stack = error.stack?.split("\n") || [];

  // Extract the caller info (stack[3] is the line above the current function call)
  if (stack.length > 3) {
    const callerLine = stack[3]; // Adjusted to capture the caller
    const match = callerLine.match(/at\s+(.*):(\d+):(\d+)/); // Regex for file, line, column
    if (match) {
      return `${match[1]}:${match[2]}`; // Returns file and line number
    }
  }
  return "Unknown Location";
}

export const consoleLog = (key: string, value?: any) => {
  const location = getCallerInfo(); // Get the caller's line number
  console.log(`[LOG] ${location} - ${key}`, value);
  AsyncStorage.setConsoleLog("LOG", location, key, value);
  const Log = AsyncStorage.getConsoleLog();
  return Log;
};

export const consoleInfo = (key: string, value?: any) => {
  const location = getCallerInfo();
  console.log(`[INFO] ${location} - ${key}`, value);
  AsyncStorage.setConsoleLog("INFO", location, key, value);
  const Log = AsyncStorage.getConsoleLog();
  return Log;
};

export const consoleWarning = (key: string, value?: any) => {
  const location = getCallerInfo();
  console.log(`[WARNING] ${location} - ${key}`, value);
  AsyncStorage.setConsoleLog("WARNING", location, key, value);
  const Log = AsyncStorage.getConsoleLog();
  return Log;
};

export const consoleError = (key: string, value?: any) => {
  const location = getCallerInfo();
  console.log(`[ERROR] ${location} - ${key}`, value);
  AsyncStorage.setConsoleLog("ERROR", location, key, value);
  const Log = AsyncStorage.getConsoleLog();
  return Log;
};

export default consoleLog;
