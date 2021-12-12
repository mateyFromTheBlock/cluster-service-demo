import { Container, Service } from 'typedi';
import admin, { app } from 'firebase-admin';
import Logger from '@/loaders/logger';
import { IAsset, IDBAsset } from '@/interfaces/IAsset';
import AssetsService from '@/services/assets';

const basePath = '/assets';

@Service()
export default class RTDBService {
  firebaseAdminApp: app.App;

  constructor() {
    const serviceAccount = require('../../secrets/androdemo-37870-firebase-adminsdk-q93if-0ecf70cb58.json');

    this.firebaseAdminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://androdemo-37870-default-rtdb.europe-west1.firebasedatabase.app',
    });

    // this.onChildChanged();

    Logger.info('✌️ RTDB consumer connected');
  }

  onChildChanged(/*callback*/) {
    return this.firebaseAdminApp
      .database()
      .ref(`/assets`)
      .on('child_changed', snapshot => {
        const child = snapshot.val();
        console.log('child_changed', new Date().getTime());
        const assetsService = Container.get(AssetsService);
        assetsService.updateLocal({ assets: Array.isArray(child) ? child : [child] });
      });
  }

  async saveToRTDB(docs: IAsset[]): Promise<void> {
    try {
      const updates = docs.reduce((acc, currDoc) => {
        acc[`${basePath}/${currDoc.id}`] = currDoc;
        return acc;
      }, {});

      await this.firebaseAdminApp.database().ref().update(updates);
    } catch (e) {
      Logger.error(`Failed to set document on rtdb: ${e}`);
    }
  }

  get(docPath = ''): Promise<IDBAsset> {
    return this.firebaseAdminApp
      .database()
      .ref(`/assets${docPath}`)
      .limitToFirst(10000)
      .once('value')
      .then(snapshot => snapshot.val())
      .catch(Logger.error);
  }
}
