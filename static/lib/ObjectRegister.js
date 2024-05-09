/**
 * @class ObjectRegister
 * @description Singleton class for enabling messaging between objects.
 */

let instance = null

export default class ObjectRegister {
    constructor() {
        if (instance) return instance
        instance = this
    }
    registerObject(obj, name) {
        this[name] = obj
    }
}