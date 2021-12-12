import { Container, Service } from 'typedi';
import { PointFeature } from 'supercluster';
import RTDBService from '@/services/rtdb';
import { IAsset } from '@/interfaces/IAsset';

interface UpdateOptions {
  assets: IAsset[];
  saveToDb?: boolean;
}

@Service()
export default class AssetsService {
  assetsDict = {};

  async init(assets?: IAsset[]): Promise<void> {
    await this.updateLocal({ assets });
  }

  updateLocal({ assets }) {
    const assetsToUpdate = assets.reduce((acc, asset) => {
      const { id, lat, lng } = asset;
      acc[id] = {
        type: 'Feature',
        geometry: {
          coordinates: [lng, lat],
        },
        properties: {
          id,
        },
      };

      return acc;
    }, {});

    this.assetsDict = {
      ...this.assetsDict,
      ...assetsToUpdate,
    };
  }

  async updateDB({ assets, saveToDb = true }: UpdateOptions): Promise<void> {
    this.updateLocal({ assets });

    // const assetsToUpdate = assets.reduce((acc, asset) => {
    //   const { id, lat, lng } = asset;
    //   acc[id] = {
    //     type: 'Feature',
    //     geometry: {
    //       coordinates: [lng, lat],
    //     },
    //     properties: {
    //       id,
    //     },
    //   };
    //
    //   return acc;
    // }, {});
    //
    // this.assetsDict = {
    //   ...this.assetsDict,
    //   ...assetsToUpdate,
    // };
    // if (saveToDb) {
    //   const rtdb = Container.get(RTDBService);
    //   await rtdb.saveToRTDB(assets);
    // }
  }

  getAssetsList(): PointFeature<any>[] {
    return Object.values(this.assetsDict);
  }
}
