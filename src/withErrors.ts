function isClass(input: any): input is new (...args: any[]) => any {
  return typeof input === 'function' && input.toString().startsWith('class ');
}

/**
 * Annotate BaseClass methods with errors
 * @param BaseClass class to annotate
 * @param errorConfig errors to link by methods
 */
export function withErrors<
  TBaseClass extends new (
    ...args: any[]
  ) => any,
  const TErrorConfig extends {
    [K in keyof InstanceType<TBaseClass>]?: {
      [errorName: string]: new (...args: any[]) => Error;
    };
  },
>(
  BaseClass: TBaseClass,
  errorConfig: TErrorConfig,
): TBaseClass &
  (new (
    ...args: ConstructorParameters<TBaseClass>
  ) => {
    [K in keyof InstanceType<TBaseClass>]: K extends keyof TErrorConfig
      ? InstanceType<TBaseClass>[K] & TErrorConfig[K]
      : InstanceType<TBaseClass>[K];
  });

/**
 * Annotate function with errors
 * @param fn function to annotate
 * @param errors errors to link
 */
export function withErrors<
  T extends (...args: any[]) => any,
  const TErrors extends { [key: string]: new (...args: any[]) => Error },
>(fn: T, errors: TErrors): T & TErrors;

export function withErrors(
  target: ((...args: any[]) => any) | (new (...args: any[]) => any),
  config: object,
): any {
  if (isClass(target)) {
    const BaseClass = target;
    const errorConfig = config;

    for (const methodName in errorConfig) {
      if (typeof BaseClass.prototype[methodName] === 'function') {
        const errors = (errorConfig as any)[methodName];
        for (const errorName in errors) {
          BaseClass.prototype[methodName][errorName] = errors[errorName];
        }
      }
    }
    return BaseClass;
  } else {
    const fn = target;
    const errors = config;
    return Object.assign(fn, errors);
  }
}
