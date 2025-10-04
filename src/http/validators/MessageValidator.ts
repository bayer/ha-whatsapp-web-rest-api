import { Request, Response } from 'express'
import { check, body, oneOf } from 'express-validator'
import Validator from './Validator'

export default async function (request: Request, response: Response): Promise<void> {
    await oneOf([
        check('to').isNumeric(),
        check('to').matches(/^.+@.+/),
        check('id').isNumeric(),
        check('id').matches(/^.+@.+/)
    ]).run(request)

    await check('msg')
        .if((value, { req }) => !req.body?.url && !req.body?.poll)
        .isString()
        .run(request)

    await check('url')
        .if((value, { req }) => !req.body?.msg && !req.body?.poll)
        .isURL()
        .run(request)

    await body('poll')
        .optional()
        .custom(p => {
            if (p === undefined) return true
            if (typeof p !== 'object' || Array.isArray(p)) {
                throw new Error('poll must be an object')
            }
            const hasName = typeof p.name === 'string' || typeof p.pollName === 'string'
            const pollOptions = p.options ?? p.pollOptions
            const hasOptions = Array.isArray(pollOptions) && pollOptions.length > 0 && pollOptions.every((o: any) => typeof o === 'string')
            if (!hasName) {
                throw new Error('poll.name or poll.pollName is required and must be a string')
            }
            if (!hasOptions) {
                throw new Error('poll.options or poll.pollOptions must be a non-empty array of strings')
            }
            if (p.sendOptions !== undefined) {
                if (typeof p.sendOptions !== 'object' || Array.isArray(p.sendOptions)) {
                    throw new Error('poll.sendOptions must be an object')
                }
                if (p.sendOptions.allowMultipleAnswers !== undefined && typeof p.sendOptions.allowMultipleAnswers !== 'boolean') {
                    throw new Error('poll.sendOptions.allowMultipleAnswers must be a boolean')
                }
                // messageSecret is optional and type can vary across lib versions; no strict type check
            }
            if (p.allowMultipleAnswers !== undefined && typeof p.allowMultipleAnswers !== 'boolean') {
                throw new Error('poll.allowMultipleAnswers must be a boolean')
            }
            return true
        })
        .run(request)

    await body('options.linkPreview').isBoolean().optional().run(request)
    await body('options.sendAudioAsVoice').isBoolean().optional().run(request)
    await body('options.sendVideoAsGif').isBoolean().optional().run(request)
    await body('options.sendMediaAsSticker').isBoolean().optional().run(request)
    await body('options.sendMediaAsDocument').isBoolean().optional().run(request)
    await body('options.caption').isString().optional().run(request)
    await body('options.quotedMessageId').isString().optional().run(request)
    await body('options.mentions').isArray().optional().run(request)
    await body('options.sendSeen').isBoolean().optional().run(request)
    await body('options.stickerName').isString().optional().run(request)
    await body('options.stickerAuthor').isString().optional().run(request)
    await body('options.stickerCategories').isArray().optional().run(request)

    Validator(request, response)
}
