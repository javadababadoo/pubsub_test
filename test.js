require('dotenv').config();

const { of, range, forkJoin, iif, from, Subject } = require("rxjs");
const { mergeMap, concatMap, delay, distinct, catchError, map, toArray, tap, filter, groupBy, scan, reduce } = require('rxjs/operators');

const {PubSub} = require(`@google-cloud/pubsub`);

const maxMessages = 20;
const maxWaitTime = 180000;

const pubsub = new PubSub();

// In this example, the message is current time
const data = new Date().toString();
const dataBuffer = Buffer.from(data);
const topicName = 'pubsub_batch';

const batchPublisher = pubsub
  .topic(topicName, {
    batching: {
      maxMessages: maxMessages,
      maxMilliseconds: maxWaitTime,
    },
  })

  const normalPublisher = pubsub
  .topic(topicName) 
  //.publisher()
  

  range(1, 10)
  .pipe(
    mergeMap(number => {
        return of(number)
        .pipe(
            mergeMap(() => forkJoin(
              batchPublisher.publish(dataBuffer),              
            )),
            //delay(1000)
        )
    }),
  ).subscribe(messageId => {
    console.log(`Batching => Message ${messageId} published.`);
  }, error => {
    console.log('Error => ', error);
  }, () => {
      console.log('Completed');
  })



  range(1, 10)
  .pipe(
    mergeMap(number => {
        return of(number)
        .pipe(
            mergeMap(() => forkJoin(
              normalPublisher.publish(dataBuffer),           
            )),
            //delay(1000)
        )
    }),
  ).subscribe(messageId => {
    console.log(`Message ${messageId} published.`);
  }, error => {
    console.log('Error => ', error);
  }, () => {
      console.log('Completed');
  })



//   for (let i = 0; i < 100; i++) {
//     (async () => {

//       batchPublisher.publish(dataBuffer)
//       .then(messageId => {
//         console.log(`Message ${messageId} published.`);
//       })
//       .catch(err => {
//         console.error('ERROR:', err);
//       });
//       console.log('i => ', i);

//     })();

    
//   }


//   const interval = setInterval(async () => {
        
//     batchPublisher.publish(dataBuffer)
//       .then(messageId => {
//         console.log(`Message ${messageId} published.`);
//       })
//       .catch(err => {
//         console.error('ERROR:', err);
//       });



//     }, 1000);