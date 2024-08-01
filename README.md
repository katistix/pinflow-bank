# Pinflow Bank - Proiect OPEN InfoEducatie 2024

The challenge was to create a banking application that is able to manage bank accounts, transactions, and generate reports. While also being able to do inter bank transfers.

[Read the complete document here](https://docs.google.com/document/u/0/d/e/2PACX-1vTqeDavNQtGt0t5NUvd9IfjMxQglrr0yzSZ6x9xRtT2qFaat-NijF_IBmEhOK74uK1wGErkY5N0x9GZ/pub?pli=1)



# API Endpoints documentation

## `/api/bankaccount`

Everything related to managing bank accounts.

### `GET /api/bankaccount/accounts`

Get all bank accounts of the authenticated user.

```ts
# Response shape
{
    bankAccounts: {
        id: string;
        userId: string;
        currency: $Enums.Currency; // 'EUR' | 'USD' | 'GBP'
        balance: number;
        iban: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }[]
}
```


### `POST /api/bankaccount/create`

Create a new bank account for the authenticated user.

```ts
# Request shape
{
    name: string; // Min length: 1, Max length: 255
    currency: $Enums.Currency; // 'EUR' | 'USD' | 'GBP'
}
```

### `POST /api/bankaccount/delete`

Delete a bank account of the authenticated user.
 
> This action is irreversible. And also all the transactions and balances will be deleted.

```ts
# Request shape
{
    bankAccountId: string;
}
```

### `/api/bankaccount/balance`

Actions related to adding funds to the bank account.

#### `POST /api/bankaccount/balance/topup/create-checkout-session`

Creates a new stripe checkout session to add funds to the bank account.

```ts
# Request shape
{
    accountID: string;
    amount: number;
    currency: string; // 'EUR' | 'USD' | 'GBP'
}
```

```ts
# Response shape
{
    id: string; // Stripe checkout session id
    url: string; // Stripe checkout session url
}
```

#### `GET /api/bankaccount/balance/topup/success`

Works like a webhook. It's called by stripe when the payment is successful.

It will add the funds to the bank account.

```ts
# Query params
{
    session_id: string; // Stripe checkout session id
}
```

### `/api/bankaccount/transactions`

Actions related to transactions of the bank account. Especially fetching the transactions.

#### `GET /api/bankaccount/pastweek/[accountID]`

Get all transactions of the past week for the given bank account.

```ts
{
    id: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    category: string | null;
    senderId: string;
    receiverId: string;
}[]
```

## `POST /api/extras`

Generate a PDF report of the bank account transactions.

```ts
# Request shape
{
    accountId: string; // The bank account id
}
```

```ts
# Response shape

Byte data of the PDF file.
```

## `POST /api/transfer/send`

Send money from one bank account to another.

```ts
# Request shape
{
    from: string; // The id of the account from which we will send money
    toIBAN: string; // The IBAN to which we will send money
    amount: number;
    category: string; // 'HOME' | 'WORK' | 'SHOPPING' | 'ENTERTAINMENT' | 'OTHER'
}
```