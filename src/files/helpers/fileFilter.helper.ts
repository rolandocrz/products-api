import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callBack: Function,
) => {
  //   console.log(file);

  if (!file) return callBack(new Error(`File is emty`), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtension = ['jpg', 'jpge', 'png'];
  if (validExtension.includes(fileExtension)) {
    callBack(null, true);
  }

  callBack(null, false);
};
