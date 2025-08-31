import { describe, expect, it } from 'vitest';
import { withCompoundErrors } from './withCompoundErrors';

class CustomError extends Error {}

describe('withCompoundErrors', () => {
  describe('class', () => {
    it('should merge errors to methods', () => {
      const MyClass = withCompoundErrors(
        class MyClass {
          method1() {
            throw new CustomError();
          }
          method2() {}
        },
        {
          method1: { CustomError },
        },
      );
      const instance = new MyClass();

      expect(instance.method1.CustomError).toEqual(CustomError);
    });

    it('should be able to check instance of in error', () => {
      const MyClass = withCompoundErrors(
        class MyClass {
          method1() {
            throw new CustomError();
          }
        },
        { method1: { CustomError } },
      );
      const instance = new MyClass();

      expect(() => instance.method1()).toThrow(instance.method1.CustomError);
    });

    it('should preserve original class', () => {
      class OriginalClass {
        method1() {
          throw new CustomError();
        }
      }
      const MyClass = withCompoundErrors(OriginalClass, {
        method1: { CustomError },
      });

      const instance = new MyClass();

      expect(MyClass).toBe(OriginalClass);
      expect(instance).toBeInstanceOf(OriginalClass);
      expect(instance.method1).toEqual(OriginalClass.prototype.method1);
    });
  });

  describe('function', () => {
    it('should merge errors to function', () => {
      const test = withCompoundErrors(
        () => {
          throw new CustomError();
        },
        { CustomError },
      );
      expect(test.CustomError).toEqual(CustomError);
    });

    it('should be able to check instance of in error', () => {
      const test = withCompoundErrors(
        () => {
          throw new CustomError();
        },
        { CustomError },
      );
      expect(() => test()).toThrow(test.CustomError);
    });

    it('should preserve original function', () => {
      const originalFunction = () => {
        throw new CustomError();
      };
      const test = withCompoundErrors(originalFunction, { CustomError });
      expect(test).toBe(originalFunction);
    });

    it('should be able to use typed error', () => {
      const test = withCompoundErrors(
        () => {
          throw new test.CustomError();
        },
        { CustomError },
      );

      expect(() => test()).toThrow(test.CustomError);
    });
  });
});
