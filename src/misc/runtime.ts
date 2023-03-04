let isDebug = false;

const setDebug = (debug: boolean) => {
    isDebug = debug;
};

const isDebugging = () => isDebug;

export const Runtime = {
    setDebug,
    isDebugging,
};
