import express from 'express';
import Item from '../schemas/items.schema.js';

const router = express.Router();

// 아이템 생성 API
router.post('/items', async (req, res, next) => {
  try {
    const { item_name, item_stat } = req.body;

    const existingItem = await Item.findOne({ item_name });
    if (existingItem) {
      return res
        .status(400)
        .json({ errorMessage: '이미 존재하는 아이템입니다.' });
    }
    const maxItem = await Item.findOne().sort('-item_code').exec();
    const item_code = maxItem ? maxItem.item_code + 1 : 1;
    // 새로운 아이템을 생성합니다.
    const newItem = new Item({ item_name, item_stat, item_code });
    await newItem.save();

    // 성공적으로 생성된 아이템을 클라이언트에게 응답합니다.
    res.status(201).json(newItem);
  } catch (error) {
    // 에러가 발생한 경우, 다음 미들웨어로 에러를 전달합니다.
    next(error);
  }
});

//아이템 목록 조회 API
router.get('/items', async (req, res, next) => {
  const items = await Item.find({}, { item_code: 1, item_name: 1, _id: 1 })
    .sort('-item_code')
    .exec();

  return res.status(200).json({ items });
});
// 아이템 상세 조회 API
router.get('/items/:itemId', async (req, res, next) => {
try{
  const {itemId} = req.params;
  const { item_name, item_stat } = req.body;

  if (!itemId) {
    return res
      .status(404)
      .json({ errorMessage: '해당 아이템이 존재하지 않습니다.' });
  }

  const itemView = await Item.findById(itemId).exec();

  if (itemView) {
    return res.status(200).json({
      data: {
        item_code:  itemView.item_code,
        item_name:  itemView.item_name,
        item_stat:  itemView.item_stat,
      },
    });
  }
}catch(error){
    next(error);
}

});

// 아이템 수정 API
router.patch('/items/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { item_code, item_name, item_stat } = req.body;

    const currentItem = await Item.findById(itemId).exec();
    if (!currentItem) {
      return res
        .status(404)
        .json({ errorMessage: '존재하지 않는 아이템입니다.' });
    }
    if (item_name) {
      currentItem.item_name = item_name;
      currentItem.item_stat = item_stat;
    }
    await currentItem.save();

    return res
      .status(200)
      .json({
        message: `아이템 '${currentItem.item_name}'의 수정이 완료되었습니다.`,
      });
  } catch (error) {
    next(error);
  }
});

export default router;
