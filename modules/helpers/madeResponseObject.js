module.exports =function showResponse (status, text, isRedirect = false, redirectPath = "", ...options ){
    return { status, msg: { text, isRedirect, redirectPath, options}}
};
