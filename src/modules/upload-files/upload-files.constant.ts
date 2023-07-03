export const LIMIT_UPLOADED_PHOTOS = 6;

export const UploadFileTypes = {
  photo: 'photo',
  video: 'video',
};

export type UploadFileType =
  (typeof UploadFileTypes)[keyof typeof UploadFileTypes];

export const UploadFileShares = {
  public: 'public',
  private: 'private',
};

export type UploadFileShare =
  (typeof UploadFileShares)[keyof typeof UploadFileShares];
