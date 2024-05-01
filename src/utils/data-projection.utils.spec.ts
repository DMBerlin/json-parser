import {
  resolveOperators,
  resolvePathValues,
} from "@utils/data-projection.utils";

describe("dataProjectUtils", () => {
  const baseObject: Record<string, any> = {
    transactionId: "1234567890",
    transactionType: "Money Transfer",
    transactionDate: "2024-01-01T00:00:00Z",
    transactionStatus: "Pending",
    sender: {
      accountId: "A123",
      accountType: "Savings",
      bank: {
        bankId: "B123",
        bankName: "Bank A",
        branchName: "Branch A",
        ifscCode: "IFSC123",
        swiftCode: "SWIFT123",
        address: {
          street: "Street A",
          city: "City A",
          state: "State A",
          country: "Country A",
          zipCode: "ZIP123",
        },
      },
    },
    receiver: {
      accountId: "B456",
      accountType: "Checking",
      bank: {
        bankId: "B456",
        bankName: "Bank B",
        branchName: "Branch B",
        ifscCode: "IFSC456",
        swiftCode: "SWIFT456",
        address: {
          street: "Street B",
          city: "City B",
          state: "State B",
          country: "Country B",
          zipCode: "ZIP456",
        },
      },
    },
    transactionDetails: {
      amount: "1000.0",
      currency: "USD",
      exchangeRate: "1.0",
      transactionFee: "10.0",
      netAmount: "990.0",
      description: "Money Transfer to Account B456",
    },
  };

  const blueprint = {
    accountId: "$sender.accountId",
    accountType: "$sender.accountType",
    transactionId: "$transactionId",
    transactionStatus: { $toUpper: "$transactionStatus" },
    transactionDetails: {
      amount: {
        $multiply: [{ $toNumber: "$transactionDetails.amount" }, 100],
      },
      currency: "$transactionDetails.currency",
      fees: {
        transactionFee: "$transactionDetails.transactionFee",
        netAmount: "$transactionDetails.netAmount",
      },
    },
  };

  it("should project", () => {
    expect(resolveOperators(resolvePathValues(baseObject, blueprint))).toEqual({
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
