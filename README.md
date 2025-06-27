# Bitespeed Backend Assignment

Assignment Link- https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-1fb21bb2a930802eb896d4409460375c

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod

---

## Hosted Endpoint

https://bitespeed-backend-assignment-ixvs.onrender.com/identify

---

## API Endpoint

### `POST /identify`

Reconciles a customer identity based on email and/or phone number.

#### Request Body
```json
{
	"email": "string",
	"phoneNumber": "number"
}
```
> Note: At least one of `email` or `phoneNumber` must be provided.

#### Response Format
```json
{
	"contact":{
                "primaryContactId": "number",
		"emails": "string[], // first element being email of primary contact",
		"phoneNumbers": "string[], // first element being phoneNumber of primary contact",
		"secondaryContactIds": "number[] // Array of all Contact IDs that are `secondary` to the primary contact"
	}
}
```
