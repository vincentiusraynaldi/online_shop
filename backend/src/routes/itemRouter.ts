import { Router } from 'express';

import { DI } from '../';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    // const items = await DI.itemRepository.findAll();
    // res.send(items);

    res.send('masuk item router');
});

router.get('/masuk', async (req, res) => {
    res.send('masuk item router');
});
export const itemRouter = router;