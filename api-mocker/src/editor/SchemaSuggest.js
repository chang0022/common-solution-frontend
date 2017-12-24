// vendorExtension
// response
// jsonReference
const clone = require('clone');

// noinspection JSUnusedGlobalSymbols
export const SchemaSuggest = {
    forSwagger: function (schema) {
// 版本声明
        schema.properties.swagger.enum.push("2.0-with-api-mocker-1.0");

// 加入条件
// "$ref": "#/definitions/responses"
        schema.definitions.scriptObject = {
            "type": "object",
            "required": [
                "script"
            ],
            "additionalProperties": false,
            "properties": {
                "script": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                }
            }
        };
        schema.definitions.response.properties["condition"] = {
            "#ref": "#/definitions/scriptObject"
        };

        // "$ref": "#/definitions/vendorExtension"
        // "oneOf": [
        schema.definitions.response.properties["hold"] = {
            "type": "object",
            "description": "ms-time to take this response.",
            "properties": {
                "multipleOf": {
                    "$ref": "#/definitions/multipleOf"
                },
                "exclusiveMinimum": {
                    "$ref": "#/definitions/exclusiveMinimum"
                },
                "default": {
                    "$ref": "#/definitions/default"
                },
                "maximum": {
                    "$ref": "#/definitions/maximum"
                },
                "exclusiveMaximum": {
                    "$ref": "#/definitions/exclusiveMaximum"
                },
                "minimum": {
                    "$ref": "#/definitions/minimum"
                },
                "title": {
                    "$ref": "http://json-schema.org/draft-04/schema#/properties/title"
                },
                "description": {
                    "$ref": "http://json-schema.org/draft-04/schema#/properties/description"
                }
            }
        };
        // 加入更多info

        // schema.definitions.info.properties["id"] = {
        //     "type": "string",
        //     "description": "A unique id of the API."
        // };
        // schema.definitions.info.properties["branch"] = {
        //     "type": "string",
        //     "default": "master",
        //     "description": "branch of this api."
        // };
        // schema.definitions.info.required.push('id');

        // cookie
        schema.definitions.cookie = clone(schema.definitions.header);
        schema.definitions.cookies = {
            "type": "object",
            "additionalProperties": {
                "$ref": "#/definitions/cookie"
            }
        };

        // 添加cookie到response
        schema.definitions.response.properties['cookies'] = {
            "$ref": "#/definitions/cookies"
        };

    }
};