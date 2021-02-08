import {PubSub} from '@google-cloud/pubsub';

import {ApiError} from './ApiError';

// Creates a client; cache this for further use
const pubSubClient = new PubSub({
  keyFilename: 'serviceAccountKey.json',
  projectId: process.env.PROJECT_ID,
});

const publishMessage = async (topicName: string, data: string) => {
  const dataBuffer = Buffer.from(data);

  try {
    console.log('Publishing message with data: ', data);
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
    return;
  } catch (error) {
    console.error(
      `Received error while publishing message with data: ${data} to topic: ${topicName}.`
    );
    console.error(error);
    throw new ApiError(500, 'Error while publishing message.');
  }
};

export {publishMessage};
