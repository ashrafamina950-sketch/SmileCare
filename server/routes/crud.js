import { Router } from 'express';
import { protect } from '../middleware/auth.js';

/**
 * Generic CRUD router.
 * - GET list / GET one are public (filtered by publicFilter) unless ?all=1 is sent by an admin token.
 * - POST / PUT / DELETE are admin only.
 */
export default function crudRouter(Model, { publicFilter = {}, sort = { createdAt: -1 }, populate = '' } = {}) {
  const router = Router();

  const isAdminReq = async (req) => {
    if (!req.headers.authorization) return false;
    let ok = false;
    await protect(req, { status: () => ({ json: () => {} }) }, () => (ok = true));
    return ok;
  };

  router.get('/', async (req, res, next) => {
    try {
      const filter = (await isAdminReq(req)) && req.query.all === '1' ? {} : publicFilter;
      res.json(await Model.find(filter).sort(sort).populate(populate));
    } catch (e) {
      next(e);
    }
  });

  router.get('/:idOrSlug', async (req, res, next) => {
    try {
      const { idOrSlug } = req.params;
      const query = /^[a-f\d]{24}$/i.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
      const doc = await Model.findOne({ ...query, ...publicFilter });
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (e) {
      next(e);
    }
  });

  router.post('/', protect, async (req, res, next) => {
    try {
      res.status(201).json(await Model.create(req.body));
    } catch (e) {
      next(e);
    }
  });

  router.put('/:id', protect, async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      Object.assign(doc, req.body);
      await doc.save();
      res.json(doc);
    } catch (e) {
      next(e);
    }
  });

  router.delete('/:id', protect, async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
