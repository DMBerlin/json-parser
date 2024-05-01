import { plainToClass } from "class-transformer";
import { JSONFlattener } from "@decorators/json-flattener.decorator";

class TestClass {
  @JSONFlattener()
  jsonProperty: any;
}

describe("JSONFlattener Decorator", () => {
  it("should work on json objects", () => {
    const jsonObject = {
      place: {
        name: "place-name",
        country: "place-country",
      },
      something: "something",
      local: {
        status: false,
        reference: 45796,
        mix: [125, false, "true"],
      },
    };

    const testClass: TestClass = plainToClass(TestClass, {
      jsonProperty: jsonObject,
    });
    expect(testClass.jsonProperty).toMatchObject(jsonObject);
  });

  it("should parse normal json string into object", async () => {
    const jsonString = JSON.stringify({
      name: "user-name",
      email: "user-email",
      prop: {
        nested: {},
        someProp: "some-prop",
      },
      identity: "user-identity",
    });

    const testClass: TestClass = plainToClass(TestClass, {
      jsonProperty: jsonString,
    });
    expect(testClass.jsonProperty).toMatchObject(JSON.parse(jsonString));
  });

  it("should work on json strings with escaped characters", () => {
    const escapedJsonString =
      '"{\\r\\n    \\"glossary\\": {\\r\\n        \\"title\\": \\"example glossary\\",\\r\\n        \\"GlossDiv\\": {\\r\\n            \\"title\\": \\"S\\",\\r\\n            \\"GlossList\\": {\\r\\n                \\"GlossEntry\\": {\\r\\n                    \\"ID\\": \\"SGML\\",\\r\\n                    \\"SortAs\\": \\"SGML\\",\\r\\n                    \\"GlossTerm\\": \\"Standard Generalized Markup Language\\",\\r\\n                    \\"Acronym\\": \\"SGML\\",\\r\\n                    \\"Abbrev\\": \\"ISO 8879:1986\\",\\r\\n                    \\"GlossDef\\": {\\r\\n                        \\"para\\": \\"A meta-markup language, used to create markup languages such as DocBook.\\",\\r\\n                        \\"GlossSeeAlso\\": [\\"GML\\", \\"XML\\"]\\r\\n                    },\\r\\n                    \\"GlossSee\\": \\"markup\\"\\r\\n                }\\r\\n            }\\r\\n        }\\r\\n    }\\r\\n}"';

    const unescapedJsonString = {
      glossary: {
        title: "example glossary",
        GlossDiv: {
          title: "S",
          GlossList: {
            GlossEntry: {
              ID: "SGML",
              SortAs: "SGML",
              GlossTerm: "Standard Generalized Markup Language",
              Acronym: "SGML",
              Abbrev: "ISO 8879:1986",
              GlossDef: {
                para: "A meta-markup language, used to create markup languages such as DocBook.",
                GlossSeeAlso: ["GML", "XML"],
              },
              GlossSee: "markup",
            },
          },
        },
      },
    };

    const testClass: TestClass = plainToClass(TestClass, {
      jsonProperty: escapedJsonString,
    });

    expect(testClass.jsonProperty).toMatchObject(unescapedJsonString);
  });
});
