const DoubleRoute =
  () => (target: Object, property: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const newArgs = args.map((item) => item * 2);
      return original(...newArgs);
    };
    return descriptor;
  };
export default DoubleRoute;
