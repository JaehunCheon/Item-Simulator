import mongoose from 'mongoose';

const itemsSchema = new mongoose.Schema({
  item_code: {
    type: Number,
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  item_stat: {
    type: Object,
    required: true,
  },
});

export default mongoose.model('Item', itemsSchema);
