import { IWhatsapp } from '../../Libs/Whatsapp'
import { Message, MessageSendOptions, Poll, PollSendOptions } from 'whatsapp-web.js'

export interface IPollMessageCreator {
    create: (
        to: string,
        pollName: string,
        pollOptions: string[],
        options?: PollSendOptions,
        messageOptions?: MessageSendOptions
    ) => Promise<Message>
}

export default class PollMessageCreator implements IPollMessageCreator {
    public constructor (private readonly whatsapp: IWhatsapp) {}

    public async create (
        to: string,
        pollName: string,
        pollOptions: string[],
        options?: PollSendOptions,
        messageOptions?: MessageSendOptions
    ): Promise<Message> {
        const poll = new Poll(pollName, pollOptions, options)
        const messageInstance = await this.whatsapp.getClient().sendMessage(to, poll, messageOptions)
        return messageInstance
    }
}
