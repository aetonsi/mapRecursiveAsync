/**
 *
 * @param {*} object
 * @param {AsyncFunction(value, key, object, keyPath)} callback
 * @param {Function(object)} [isObject]
 * @returns AsyncFunction
 */
export const mapRecursiveAsync = async (
  object,
  callback,
  isObject = object => Object.prototype.toString.call(object) === '[object Object]' // alternatives: lodash.isPlainObject, jonschlinkert/is-plain-object
) => (await (
  async function worker(something, keyPath) {
    let result;
    if (Array.isArray(something) && something.length > 0) { // recurse
      result = [];
      for (let i = 0; i < something.length; i++) {
        result[i] = await worker(something[i], [...keyPath, i]);
      }
    } else if (isObject(something) && Object.keys(something).length > 0) { // recurse
      result = {};
      for (let k in something) {
        result[k] = await worker(something[k], [...keyPath, k]);
      }
    } else { // callback
      result = await callback(
        something,
        keyPath[keyPath.length - 1],
        object,
        keyPath
      );
    }
    return result;
  }
)(object, []));
