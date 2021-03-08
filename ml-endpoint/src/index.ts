require('dotenv').config();
const {v1} = require('@google-cloud/pubsub');
import axios from 'axios';
import {updateActualResultByImageId} from './sql';
import {getImageFromStorage} from './storage';

const projectId = process.env.PROJECT_ID;
const subscriptionName = process.env.PUBSUB_SUBSCRIPTION_NAME;

// Creates a client; cache this for further use.
const subClient = new v1.SubscriberClient({
  keyFilename: 'serviceAccountKey.json',
});

const formattedSubscription = subClient.subscriptionPath(
  projectId,
  subscriptionName
);

async function synchronousPull() {
  // The maximum number of messages returned for this request.
  // Pub/Sub may return fewer than the number specified.
  const request = {
    subscription: formattedSubscription,
    maxMessages: 10,
  };

  // The subscriber pulls a specified number of messages.
  const [response] = await subClient.pull(request);
  console.log('response length', response.receivedMessages.length);

  if (response.receivedMessages.length <= 0) {
    return [];
  }

  // Process the messages.
  // const ackIds = [];
  // const messages: {
  //   imageId: string;
  //   fileName: string;
  // }[] = [];
  for (const message of response.receivedMessages) {
    console.log(`Received message: ${message.message.data}`);
    // ackIds.push(message.ackId);
    // messages.push(JSON.parse(message.message.data));
  }

  // if (ackIds.length !== 0) {
  //   // Acknowledge all of the messages. You could also ackknowledge
  //   // these individually, but this is more efficient.
  //   const ackRequest = {
  //     subscription: formattedSubscription,
  //     ackIds: ackIds,
  //   };

  //   await subClient.acknowledge(ackRequest);
  // }

  console.log('Done.');
  return response.receivedMessages;
}

async function ackMessage(ackIds: string[]) {
  if (ackIds.length !== 0) {
    // Acknowledge all of the messages. You could also ackknowledge
    // these individually, but this is more efficient.
    const ackRequest = {
      subscription: formattedSubscription,
      ackIds: ackIds,
    };

    await subClient.acknowledge(ackRequest);
  }

  console.log('Done.');
}

async function predictImage(imageId: string, fileName: string) {
  console.log('predicting image...');
  console.log('imageId: ', imageId);
  console.log('fileName:', fileName);

  console.log('Getting image from URL...');
  // const response = await axios.get(imageUrl);
  // const image: Buffer = response.data;
  const image: Buffer = await getImageFromStorage(fileName);
  console.log('Get image done.');

  console.log('Sending image to model...');
  let modelResponse: any;
  try {
    modelResponse = await axios.post(process.env.MODEL_URL || '', {
      instances: [
        {
          image_bytes: {
            b64: image.toString('base64'),
          },
          key: imageId,
        },
      ],
    });
    console.log('Send image to model done.');
  } catch (error) {
    console.error('something is wrong while sending image to model');
    throw error;
  }

  if (
    !modelResponse ||
    !modelResponse.data ||
    !modelResponse.data.predictions ||
    modelResponse.data.predictions.length <= 0 ||
    !modelResponse.data.predictions[0].scores ||
    modelResponse.data.predictions[0].scores.length <= 0
  ) {
    console.error('something is wrong with modelResponse', modelResponse.data);
    throw Error(modelResponse.data.predictions[0]);
  }

  console.log(modelResponse.data.predictions[0]);
  // console.log(modelResponse.data.predictions[0].scores);
  // console.log(modelResponse.data.predictions[0].labels);

  let banProb: number;

  if (modelResponse.data.predictions[0].labels[0] === 'ban') {
    banProb = modelResponse.data.predictions[0].scores[0];
  } else {
    banProb = modelResponse.data.predictions[0].scores[1];
  }

  let predictionResult: string;

  // classify by the probability
  if (banProb >= 0.9) {
    predictionResult = 'BAN';
  } else if (banProb < 0.9 && banProb >= 0.6) {
    predictionResult = 'UNCERTAIN';
  } else {
    predictionResult = 'PASS';
  }

  // update result to DB
  await updateActualResultByImageId(imageId, predictionResult);
}

async function main() {
  console.log('Server in running...');
  let isPaused = false;
  setInterval(async () => {
    if (isPaused) {
      return;
    }
    isPaused = true;

    try {
      const messages = await synchronousPull();

      if (messages.length <= 0) {
        // NO MESSAGE IN THE QUEUE
        console.log('No message received');
      } else {
        // HAVE MESSAGE
        console.log('have message');
        const ackIds: string[] = [];
        for (const message of messages) {
          try {
            const messageData: {
              imageId: string;
              fileName: string;
            } = JSON.parse(message.message.data);
            console.log(messageData);
            await predictImage(messageData.imageId, messageData.fileName);
            ackIds.push(message.ackId);
          } catch (error) {
            console.error(error);
          }
        }
        ackMessage(ackIds);
      }
    } catch (error) {
      console.error(error);
    }
    isPaused = false;
  }, 5000);
}

main().catch(console.error);
// synchronousPull().catch(console.error);
