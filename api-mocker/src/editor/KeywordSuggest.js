var Bool = ["true", "false"]

const scriptObject = {
    script: String,
    description: String
};

const holdKeyword = {
    description: String,
    title: String,
    minimum: String,
    maximum: String,
    exclusiveMinimum: Bool,
    exclusiveMaximum: Bool,
    multipleOf: String,
    default: String,
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
        origin.hold = holdKeyword;
        return origin
    },
    changeInfo: function (origin) {
        // origin.id = String;
        // origin.branch = String;
        return origin;
    }
};
