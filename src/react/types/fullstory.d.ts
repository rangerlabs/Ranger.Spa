interface Fullstory {
    identify(uid: string, userVars?: object): void;
    setUserVars(userVars: object): void;
    getCurrentSessionURL(): string;
    log(msg: string);
    log(level: string, msg: string);
    shutdown();
    restart();
    consent(consent: boolean);
}

declare var FS: Fullstory;
