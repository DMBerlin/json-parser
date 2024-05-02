import { bfsParseTraversal } from "@utils/data-projection.utils";
import {
  baseOriginFixture,
  blueprintFixture,
} from "@utils/__fixtures__/data-projection.fixtures";

describe("dataProjectUtils", () => {
  it("should project to the correct result", () => {
    expect(bfsParseTraversal(baseOriginFixture, blueprintFixture)).toEqual({
      accountId: "A123",
      accountType: "Savings",
      transactionId: "1234567890",
      transactionStatus: "PENDING",
      transactionDetails: {
        amount: 100000,
        currency: "USD",
        fees: { transactionFee: "10.0", netAmount: "990.0" },
      },
    });
  });
});
