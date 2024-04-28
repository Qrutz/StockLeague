import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  // brokers: ['localhost:9092']
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

export default producer;
