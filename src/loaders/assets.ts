// @TODO - load assets initial batch
import { Container } from 'typedi';
import AssetsService from '@/services/assets';
import RTDBService from '@/services/rtdb';
import { IDBAsset } from '@/interfaces/IAsset';
import { v4 as uuidv4 } from 'uuid';
import faker from 'faker';
import config from '@/config';

const load = async (): Promise<IDBAsset> => {
  if (config.loadAssetsOnStart) {
    const firebaseService = Container.get(RTDBService);
    return firebaseService.get();
  }

  return {};


  // return Array(2000000)
  //   .fill(0)
  //   .reduce((acc, curr) => {
  //     const id = uuidv4();
  //     acc[id] = {
  //       id,
  //       lat: faker.datatype.number({
  //         min: -20,
  //         max: 20,
  //         precision: 0.0001,
  //       }),
  //       lng: faker.datatype.number({
  //         min: -80,
  //         max: 80,
  //         precision: 0.0001,
  //       }),
  //     };
  
  //     return acc;
  //   }, {});
};

export default async (): Promise<void> => {
  console.time('load');
  const assetsDict = await load();
  console.timeEnd('load');
  console.log({ assetsDict: Object.values(assetsDict).length });
  const assetList = Object.values(assetsDict);
  const assetsService = new AssetsService();
  await assetsService.init(assetList);
  Container.set(AssetsService, assetsService);
};
