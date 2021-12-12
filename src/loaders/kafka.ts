import KafkaConsumer from '@/kafka/assetsConsumer';
import Logger from './logger';
import AssetsService from '@/services/assets';
import { Container } from 'typedi';

const connectEventName = 'consumer.connect';

const eachMessage = async ({ message }) => {
  try {
    console.log('asset_changed', new Date().getTime());
    const asset = JSON.parse(message.value);
    const assetsService = Container.get(AssetsService);
    await assetsService.updateDB({ assets: Array.isArray(asset) ? asset : [asset] });
  } catch (e) {
    Logger.error(`Error occured while processing kafka msg: ${e}`);
  }
};

const eachBatch = async ({ batch }) => {
  console.log({ batch });
};

export default async (): Promise<void> => {
  const consumer = new KafkaConsumer({ topic: 'assets' });
  consumer.consumer.on(connectEventName, () => Logger.info('✌️ Kafka consumer connected'));
  await consumer.connect({ eachMessage, eachBatch });
};
