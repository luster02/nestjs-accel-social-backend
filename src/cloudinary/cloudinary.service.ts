import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { Cloudinary } from './cloudinary.provider'
import { IEnvironmentVariables } from '../config/config.interface'
import { FileUpload } from '@gql/scalars/upload.scalar'
import { UploadResponse } from './interfaces/upload-response.interface'

@Injectable()
export class CloudinaryService {
    private v2: any
    constructor(
        @Inject(Cloudinary)
        private cloudinary,
        @Inject(ConfigService)
        private readonly _config: ConfigService<IEnvironmentVariables>
    ) {
        this.cloudinary.v2.config({
            cloud_name: this._config.get('CLOUD_NAME'),
            api_key: this._config.get('API_KEY'),
            api_secret: this._config.get('API_SECRET')
        })
        this.v2 = cloudinary.v2
    }

    async upload(file: any, folder: any) {
        return await this.v2.uploader.upload(file, { folder })
    }

    async destroy(publicId: string) {
        return await this.v2.uploader.destroy(publicId)
    }

    async create_folder(foler: string) {
        return await this.v2.api.create_folder(foler)
    }

    async delete_folder(foler: string) {
        return await this.v2.api.delete_folder(foler)
    }

    async sub_folders(foler: string) {
        return await this.v2.api.sub_folders(foler)
    }

    async upload_stream(fileInput: FileUpload, foler: string): Promise<UploadResponse> {
        return new Promise((resolve, reject) => {
            const streamLoad = this.cloudinary.v2.uploader.upload_stream({ foler }, function (err, image) {
                if (err) {
                    (reject(err))
                } else {
                    resolve({ public_id: image.public_id, secure_url: image.secure_url })
                }
            });
            fileInput.createReadStream().pipe(streamLoad)
        })
    }

    uploader() {
        return this.v2.uploader
    }

    api() {
        return this.v2.api
    }
}