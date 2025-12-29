import { Request } from 'express';
import {v4 as uuid} from 'uuid'

export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  callBack: Function,
) => {
  //   console.log(file);

  if (!file) return callBack(new Error(`File is emty`), false);

  const fileExtension = file.mimetype.split('/')[1];
  
  const fileName = `${uuid()}.${fileExtension}`

  callBack(null, fileName);
};
