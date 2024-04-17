import { IpcMainEvent, ipcMain } from 'electron';

const GADE = {
    receive: (
        id: string,
        callback: (event: IpcMainEvent, ...args: any[]) => void,
    ) => ipcMain.on(id, callback),
    register: (channel: string, callback: Function) => {
        GADE.receive(channel, (event, ...args) => {
            const result = callback(...args);

            if (result instanceof Promise) {
                result
                    .then((value) => event.reply(channel, value))
                    .catch(() => event.reply(channel, undefined));
            } else {
                event.reply(channel, result);
            }
        });
    },
};

export default GADE;
