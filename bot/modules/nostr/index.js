// @ts-check
require('websocket-polyfill');
const logger = require('../../../logger');
const Config = require('./config');
const { orderCreated } = require('./events');

exports.configure = bot => {
  require('./commands')(bot);

  if (!Config.getRelays().length) {
    ['wss://nostr-pub.wellorder.net', 'wss://relay.damus.io'].map(
      Config.addRelay
    );
  }

  const OrderEvents = require('../events/orders');
  OrderEvents.onOrderCreated(async order => {
    try {
      const event = orderCreated(order);
      await publish(event);
      return event;
    } catch (err) {
      logger.warn(err);
    }
  });
  OrderEvents.onOrderTaken(order => {
    // todo: notify creator
    console.log('OrderTaken', order);
  });
};

async function publish(event) {
  const p = new Promise((resolve, reject) => {
    const pub = Config.pool.publish(Config.getRelays(), event);
    pub.on('ok', () => resolve(event));
    pub.on('failed', reject);
  });
  return p;
}
