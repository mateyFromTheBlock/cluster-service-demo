import express, { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import Logger from '@/loaders/logger';
import { celebrate, Joi } from 'celebrate';
import QueryString from 'qs';
import Supercluster from 'supercluster';
import AssetsService from '@/services/assets';

const route = Router();

export default (app: Router) => {
  app.use('/geo', route);

  route.get(
    '/',
    celebrate({
      query: Joi.object({
        bounds: Joi.string().required(),
        zoom: Joi.number().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { zoom, bounds }: QueryString.ParsedQs = req.query;
        console.log({ zoom })
        const index = new Supercluster({
          radius: 150,
          minZoom: +zoom - 2,
          maxZoom: Math.min(+zoom - 1, 21),
          log: true,
        });

        const assetsService = Container.get(AssetsService);

        index.load(assetsService.getAssetsList());
        // const tiles = index.getTile(+zoom - 1, 42, 39);
        // console.log({ tiles: tiles?.features[0] });
        const clusters = index.getClusters(JSON.parse(bounds.toString()).flat(), +zoom - 1);
        res.json({ clusters });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
