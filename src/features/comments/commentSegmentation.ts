export default {
  nlp: function (_text: string): Promise<string[]> {
    return Promise.reject(new Error('评论分词服务尚未配置'));
  },
};
