'use strict'
const mqtt = require('mqtt');
const Config = require('config');
const Lockitron = require('./lockitron');
const mqttConf = Config.get('mqtt');
const lockitronConfig = Config.get('lockitron');

const lockitronClient = new Lockitron(lockitronConfig)
let locks = {};

async function queryLocks() {
  lockData = await lockitronClient.locks();
  lockData.forEach((lock) => {
    let name = lock.name.toLowerCase().replace(/ /g, '_');
    locks[name] = lock;
  });
}

function publishLocks() {
  locks.forEach((lock)=> {
    let name = lock.name.toLowerCase().replace(/ /g, '_');
    let message = {
      id: lock.id,
      name: lock.name,
      state: lock.state,
      updatedAt: lock.updated_at,
      batteryPercentage: lock.battery_percentage,
      connected: lock.connected
    };
    mqttClient.publish(
      `${mqttConf.topic}/status/lock/${name}`,
      JSON.stringify(message),
      { qos: 0
      , retain: true
      }
    );
  })
}

let mqttOptions = {
  will: {
    topic: `${mqttConf.topic}/connected`,
    message: 0,
    qos: 0
  }
};

if (mqttConf.username && mqttConf.password) {
  mqttOptions.username = mqttConf.username;
  mqttOptions.password = mqttConf.password;
}

const mqttClient = mqtt.connect(`mqtts://${mqttConf.host}`, mqttOptions);

mqttClient.on('connect', async () => {
  console.log(`Connected to MQTT: ${mqttConf.host}`);
  await queryLocks();
  publishLocks();
});

mqttClient.on('message', (topic, message) => {
	if (!lockitronClient) return;

	console.log(topic, message);
  if (topic.startsWith(${mqttConf.topic}/set/lock/)) {
    let lockName = topci.substr(topic.lastIndexOf('/') + 1);
    console.log('Locking: ', lockName);
    if (locks[lockName]) {
      let lock = locks[lockName];
      lockitronClient.lock(lock.id);
    }
  }
  if (topic.startsWith(${mqttConf.topic}/set/unlock/)) {
    let lockName = topci.substr(topic.lastIndexOf('/') + 1);
    console.log('Unlocking: ', lockName);
    if (locks[lockName]) {
      let lock = locks[lockName];
      lockitronClient.unlock(lock.id);
    }
  }
});

mqttClient.on('error', (err) => {
  console.log('MQTT Error: ', err);
})

setInterval(queryLocks, 1000000);
