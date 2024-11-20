/* eslint-disable @typescript-eslint/no-explicit-any */
import getNewDate from "../common/helper/function/newDate.Function";
import { AsyncLocalStorage } from "async_hooks";
import { injectable } from "tsyringe";

@injectable()
export class AsyncStorage {
  private static asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  // To run a new async context
  static run(fn: () => void) {
    this.asyncLocalStorage.run(new Map<string, any>(), fn);
  }

  // To store a value in the current async context
  static set(key: string, value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  // To retrieve a value from the current async context
  static get(key: string): any {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  }

  static setRequestID(value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set("requestID", value);
    }
  }

  static getRequestID(): any {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get("requestID") : null;
  }

  static setUserID(value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set("userID", value);
    }
  }

  static getUserID(): any {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get("userID") : null;
  }

  static setServiceName(value: string) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set("serviceName", value);
    }
  }

  static getServiceName(): string {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get("serviceName") : "";
  }

  static setAxiosLogger(value: boolean = true) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set("axiosLogger", value);
    }
  }

  static getAxiosLogger(): string {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get("axiosLogger") : true;
  }

  static setAPIVersion(value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set("apiVersion", value);
    }
  }

  static getAPIVersion(): any {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get("apiVersion") : "";
  }

  static getByPassConfig(): any {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get("ByPass") : {};
  }

  static setByPassConfig(value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set("ByPass", value);
    }
  }

  static setExpandObject(value: boolean = false) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set("expandObject", value);
    }
  }
  static getExpandObject(): any {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get("expandObject") : false;
  }

  static setConsoleLog(
    type: "LOG" | "INFO" | "ERROR" | "WARNING",
    location: any,
    key: string,
    value?: any
  ) {
    const store = this.asyncLocalStorage.getStore();
    let consoleLog = [];
    if (store) {
      if (store.get("consoleLog")) {
        consoleLog = store.get("consoleLog");
      }
    }
    if (key) {
      const addLog = [
        ...consoleLog,
        { type, key, value, timestamp: getNewDate(), location },
      ];
      if (store) {
        store.set("consoleLog", addLog);
      }
    }
  }
  static getConsoleLog(): any {
    const store = this.asyncLocalStorage.getStore();
    return store
      ? store.get("consoleLog")
        ? store.get("consoleLog")
        : []
      : [];
  }
}

export default AsyncStorage;
