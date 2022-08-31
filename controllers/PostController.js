import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить все статьи!',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Не удалось вернуть статью!',
          });
        }
        if (!doc)
          return res.status(404).json({
            message: 'Статья не найдена!',
          });
        res.json(doc);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статью!',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete({ _id: postId }, (error, doc) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: 'Не удалось удалить статью!',
        });
      }
      if (!doc)
        return res.status(404).json({
          message: 'Статья не найдена!',
        });
      res.json({
        succes: true,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось удалить статью!',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};
