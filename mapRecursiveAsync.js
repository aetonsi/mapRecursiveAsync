const mapRecursiveAsync = async (object, callback, isObjectOverride = null) => {
  // isObject alternatives: lodash.isPlainObject, jonschlinkert/is-plain-object
  const isObject = !!isObjectOverride ? isObjectOverride : object => Object.prototype.toString.call(object) === '[object Object]';
  return await (async function worker(something, callback, key, object) {
    let result;
    if (Array.isArray(something)) {
      result = [];
      for (let i = 0; i < something.length; i++) {
        result[i] = await worker(something[i], callback, i, something);
      }
    } else if (isObject(something)) {
      result = {};
      for (let k in something) {
        result[k] = await worker(something[k], callback, k, something);
      }
    } else {
      result = await callback(something, key, object);
    }
    return result;
  })(object, callback, void 0, object);
};
