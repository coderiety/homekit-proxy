const {
  Accessory: {
    Categories: { FAN, LIGHTBULB, DOOR_LOCK, SENSOR, SWITCH }
  },
  Characteristic: {
    BatteryLevel,
    Brightness,
    On,
    RotationSpeed,
    LockTargetState,
    LockCurrentState
  },
  Service: { BatteryService, Fan, Lightbulb, LockMechanism, Switch }
} = require('hap-nodejs');

module.exports = {
  'multilevel-fan': {
    category: FAN,
    Service: Fan,
    characteristics: [
      {
        cid: On,
        cname: 'power',
        classId: 0x26,
        toHap: n => (n ? 1 : 0),
        toZwave: n => (n ? 'use level' : 0)
      },
      {
        cid: RotationSpeed,
        cname: 'speed',
        classId: 0x26,
        isLevel: true,
        toHap: n => Math.floor((n / 99) * 100),
        toZwave: n => Math.ceil((n / 100) * 99)
      }
    ]
  },
  'binary-switch': {
    category: SWITCH,
    Service: Switch,
    characteristics: [
      {
        cid: On,
        cname: 'power',
        classId: 0x25,
        toHap: n => (n ? 1 : 0),
        toZwave: n => !!n
      }
    ]
  },
  'binary-light': {
    category: LIGHTBULB,
    Service: Lightbulb,
    characteristics: [
      {
        cid: On,
        cname: 'power',
        classId: 0x25,
        toHap: n => (n ? 1 : 0),
        toZwave: n => !!n
      }
    ]
  },
  'multilevel-light': {
    category: LIGHTBULB,
    Service: Lightbulb,
    characteristics: [
      {
        cid: On,
        cname: 'power',
        classId: 0x26,
        toHap: n => (n ? 1 : 0),
        toZwave: n => (n ? 'use level' : 0)
      },
      {
        cid: Brightness,
        cname: 'brightness',
        classId: 0x26,
        isLevel: true,
        toHap: n => Math.floor((n / 99) * 100),
        toZwave: n => Math.ceil((n / 100) * 99)
      }
    ]
  },
  lock: {
    category: DOOR_LOCK,
    Service: LockMechanism,
    characteristics: [
      {
        cid: LockCurrentState,
        cname: 'state',
        classId: 0x62,
        hasTarget: true,
        toHap: n => (n ? LockTargetState.SECURED : LockTargetState.UNSECURED),
        toZwave: n => n === LockTargetState.SECURED
      },
      {
        cid: LockTargetState,
        cname: 'target state',
        classId: 0x62,
        isTarget: true,
        toHap: n => (n ? LockTargetState.SECURED : LockTargetState.UNSECURED),
        toZwave: n => n === LockTargetState.SECURED
      }
    ]
  },
  battery: {
    category: SENSOR,
    Service: BatteryService,
    characteristics: [
      {
        cid: BatteryLevel,
        cname: 'level',
        classId: 0x80
      }
    ]
  }
};
