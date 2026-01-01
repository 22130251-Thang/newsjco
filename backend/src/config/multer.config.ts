import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
    storage: diskStorage({
        destination: './data/avt_user',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `avatar-${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return callback(
                new BadRequestException('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)'),
                false,
            );
        }
        callback(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
};
