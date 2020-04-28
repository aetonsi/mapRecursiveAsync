const mapRecursiveAsync = async (
  object,
  callback,
  isObject = object => Object.prototype.toString.call(object) === '[object Object]' // alternatives: lodash.isPlainObject, jonschlinkert/is-plain-object
) => await (async function worker(something, callback, key, object) {
  let result;
  if (Array.isArray(something)) {
    result = [];
    for (let i = 0; i < something.length; i++) {
      result[i] = await worker(something[i], callback, [...key, i], something);
    }
  } else if (isObject(something)) {
    result = {};
    for (let k in something) {
      result[k] = await worker(something[k], callback, [...key, k], something);
    }
  } else {
    result = await callback(something, key, object);
  }
  return result;
})(object, callback, [], object);
