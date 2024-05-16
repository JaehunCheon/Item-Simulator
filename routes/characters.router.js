import express from 'express';
import Character from '../schemas/characters.schema.js';
import joi from 'joi';
const router = express.Router();

const createdCharacterSchema = joi.object({
  name: joi.string().min(2).max(12).required(),
});

// 캐릭터 생성 API
router.post('/characters', async (req, res, next) => {
  try {
    const validation = await createdCharacterSchema.validateAsync(req.body);

    const { name } = validation;

    if (!name) {
      return res
        .status(400)
        .json({ errorMessage: '캐릭터 이름 데이터가 존재하지 않습니다.' });
    }
    const existingCharacter = await Character.findOne({ name });
    if (existingCharacter) {
      return res
        .status(400)
        .json({ errorMessage: '이미 존재하는 캐릭터 이름입니다.' });
    }

    const maxId = await Character.findOne().sort('-character_id').exec();
    const character_id = maxId ? maxId.character_id + 1 : 1;

    const newCharacter = new Character({ name, character_id });
    await newCharacter.save();

    res
      .status(201)
      .json({
        message: `새로운 캐릭터 '${newCharacter.name}'를 생성하셨습니다!`,
        data: `${character_id}`,
      });
  } catch (error) {
    next(error);
  }
});

// 캐릭터 조회 API
router.get('/characters', async (req, res) => {
  const characters = await Character.find().sort('-character_id').exec();

  return res.status(200).json({ characters });
});
// 캐릭터 상세조회 API
router.get('/characters/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    if (!characterId) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const characterView = await Character.findById(characterId).exec();

    if (characterView) {
      return res
        .status(200)
        .json({
          data: {
            name: `${characterView.name}`,
            health: `${characterView.health}`,
            power: `${characterView.power}`,
          },
        });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ errorMessage: '캐릭터 조회에 실패하였습니다.' });
  }
});
// 캐릭터 삭제 API
router.delete('/characters/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;

    if (!characterId) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const characterName = await Character.findById(characterId).exec();

    await Character.deleteOne({ _id: characterId });

    return res
      .status(200)
      .json({ message: `캐릭터 '${characterName.name}'를 삭제하였습니다.` });
  } catch (error) {
    return res
      .status(404)
      .json({ errorMessage: '캐릭터 조회에 실패하였습니다.' });
  }
});

export default router;
