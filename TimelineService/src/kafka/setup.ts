import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'timeline-service',
  brokers: ['172.25.47.103:9092'],
});

const consumer = kafka.consumer({ groupId: 'feed-group' });

export { kafka, consumer };
