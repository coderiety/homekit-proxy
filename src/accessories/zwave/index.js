const _ = require('underscore');
const Base = require('../base');
const getZwave = require('./get-zwave');
const log = require('../../utils/log');
const types = require('./types');

module.exports = class extends Base {
  constructor(options) {
    super(options);

    const { client, refreshValue, setValue, values } = getZwave(options);
    const { name, nodeId, type } = options;
    const { category, characteristics, Service } = types[type];
    this.category = category;
    this.level = 99;
    const service = new Service(name);
    _.each(
      characteristics,
      ({
        cid,
        classId,
        cname,
        hasTarget = false,
        index = 0,
        instance = 1,
        isLevel,
        isTarget = false,
        toHap = _.identity,
        toZwave = _.identity
      }) => {
        const char = service.getCharacteristic(cid);
        const key = [nodeId, classId, instance, index].join('-');
        const value = values[key];
        char.on('change', ({ oldValue, newValue }) =>
          log.change(name, cname, oldValue, newValue)
        );
        if (value != null) char.updateValue(toHap(value));

        client.on(`value:${key}`, value => char.updateValue(toHap(value)));

        if (!isTarget) {
          char.on('get', cb => {
            cb(null, char.value);

            refreshValue(key);
          });
        }

        if (!hasTarget) {
          char.on('set', (value, cb) => {
            cb();

            value = toZwave(value);
            if (isLevel && value) this.level = value;
            if (value === 'use level') value = this.level;
            setValue(key, value);
          });
        }
      }
    );

    this.addService(service);
  }
};
