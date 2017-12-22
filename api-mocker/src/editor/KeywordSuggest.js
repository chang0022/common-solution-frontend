const scriptObject = {
    script: String,
    description: String
};
var combine = (...objs) => objs ? Object.assign({}, ...objs) : {};
// noinspection JSUnusedGlobalSymbols
export const KeywordSuggest = {

    changeResponse: function (header, origin) {
        origin.condition = scriptObject;
        origin.cookies = {
            ".": combine(header, {
                __value: ""
            })
        };
        return origin
    },
    changeInfo: function (origin) {
        origin.id = String;
        origin.branch = String;
        return origin;
    }
};
