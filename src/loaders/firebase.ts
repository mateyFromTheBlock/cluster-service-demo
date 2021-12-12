import { Container } from 'typedi';
import RTDBService from '@/services/rtdb';

export default (): void => {
  const rtdbService = new RTDBService();
  Container.set(RTDBService, rtdbService);
};
