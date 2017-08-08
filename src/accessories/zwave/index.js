const _ = require('underscore');
const Base = require('../base');
const getZwave = require('./get-zwave');
const types = require('./types');

module.exports = class extends Base {
  constructor(options) {
    super(options);

    const {client, refreshValue, setValue, values} = getZwave(options);
    const {name, nodeId, type} = options;
    const {Service, characteristics} = types[type];
    const service = new Service(name);
    _.each(characteristics, ({
      cid,
      classId,
      cname,
      hasTarget = false,
      index = 0,
      instance = 1,
      isTarget = false,
      toHap = _.identity,
      toZwave = _.identity
    }) => {
      const char = service.getCharacteristic(cid);
      const key = [nodeId, classId, instance, index].join('-');
      const value = values[key];
      char.on('change', ({oldValue, newValue}) =>
        console.log(`[${name}] ${cname}: ${oldValue} -> ${newValue}`)
      );
      if (value != null) char.updateValue(toHap(value));

      client.on(`value:${key}`, value => char.updateValue(toHap(value)));

      if (!isTarget) {
        char.on('get', cb => {
          refreshValue(key);
          const value = values[key];
          if (value == null) return cb(new Error('Unknown value!'));

          cb(null, toHap(value));
        });
      }

      if (!hasTarget) {
        char.on('set', (value, cb) => {
          setValue(key, toZwave(value), isTarget ? _.noop : cb);
          if (isTarget) cb();
        });
      }
    });

    this.addService(service);
  }
};
