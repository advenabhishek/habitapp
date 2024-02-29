const Expo = require("expo-server-sdk").Expo
let expo = new Expo()
const NotificationModel = require('../model/notification')

async function processNotification() {
  while (true) {

    // read from notification db which is active whose time is less than current time
    let notificationList = await NotificationModel.find({
      time: { $lt: new Date() },
      active: true,
    })

    //create a batch and send notfication
    sendBatchNotificationViaExpo(notificationList)

    // modify active status to false
    await NotificationModel.updateMany({
      _id: { $in: (notificationList).map(i => i._id) }
    }, {
      $set: { active: false }
    })

    // add new notification to queue
    updatedNotificationList = notificationList
      .filter(i => i.frequency)
      .map(i => {
        i = i.toObject()
        let item = {
          ...i,
          time: new Date(new Date(i.time).getTime() + i.frequency)
        }
        delete item._id
        return item
      })
    // console.log(updatedNotificationList)
    NotificationModel.insertMany(updatedNotificationList)

    // wait for a minute
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
    // console.log('sleeping for a minute')
    await sleep(1000 * 60)

  }
}

async function sendBatchNotificationViaExpo(notificationList) {
  let messages = []

  for (let notification of notificationList) {
    if (!Expo.isExpoPushToken(notification.token)) {
      console.error(`Push token ${notification.token} is not a valid Expo push token`)
      continue
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: notification.token,
      sound: 'default',
      body: notification.body,
      title: notification.title,
    })
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk)
        // console.log(ticketChunk)
        tickets.push(...ticketChunk)
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error)
      }
    }
  })()

}

module.exports = processNotification


// processNotification()