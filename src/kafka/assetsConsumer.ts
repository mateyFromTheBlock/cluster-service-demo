import { Kafka, Consumer, EachMessagePayload, EachBatchPayload } from 'kafkajs';
import config from '@/config';

export default class KafkaConsumer {
  groupId: string;
  consumer: Consumer;
  kafka: Kafka;
  topic: string;

  constructor({
    groupId = config.kafka.groupId,
    clientId = config.kafka.clientId,
    brokers = config.kafka.brokers,
    topic = config.kafka.topic,
  }) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.groupId = groupId;
    this.consumer = this.kafka.consumer({ groupId: this.groupId });
    this.topic = topic;
  }

  async connect(config?: {
    autoCommit?: boolean;
    autoCommitInterval?: number | null;
    autoCommitThreshold?: number | null;
    eachBatchAutoResolve?: boolean;
    partitionsConsumedConcurrently?: number;
    eachBatch?: (payload: EachBatchPayload) => Promise<void>;
    eachMessage?: (payload: EachMessagePayload) => Promise<void>;
  }): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic });
    await this.consumer.run(config);
  }

  disconnect() {
    return this.consumer.disconnect();
  }
}
