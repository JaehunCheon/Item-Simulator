// schemas/character.schema.js

import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // value 필드는 필수 요소입니다.
    unique: true,
  },
  character_id: {
    type: Number,
    required: true, // order 필드 또한 필수 요소입니다.
  },
  health: {
    type: Number,
    default: 500,
  },
  power: {
    type: Number,
    default: 100,
  },
  equippedItems:[
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Item',
    }
  ]
});

// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!

// characterSchema를 바탕으로 Character 모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Character', characterSchema);
