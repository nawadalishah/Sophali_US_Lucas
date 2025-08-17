# Sophali Backend

A Node.js/TypeScript backend application with MongoDB integration.

## Features

- MongoDB database integration with Mongoose
- TypeScript support
- Comprehensive test suite with Jest
- Cart and Order management system
- Type-safe enums and interfaces

## Project Structure

```
src/
├── @types/           # TypeScript type definitions
├── platform/
│   └── models/       # Mongoose models
├── test/             # Test files
│   ├── models/       # Model tests
│   ├── integration/  # Integration tests
│   ├── types/        # Type definition tests
│   ├── utils/        # Test utilities
│   └── __mocks__/    # Mock files
└── server.ts         # Main server file
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create a .env file with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/your-database
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with coverage:
```bash
npm run test:coverage
```

### Run specific test files:
```bash
# Run only Cart model tests
npm test -- Cart.model.test.ts

# Run only integration tests
npm test -- integration

# Run only type tests
npm test -- types
```

## Test Structure

### Model Tests
- **Cart.model.test.ts**: Tests for Cart model validation and operations
- **Order.model.test.ts**: Tests for Order model validation and operations

### Integration Tests
- **cart-order.test.ts**: Tests the interaction between Cart and Order models

### Type Tests
- **index.test.ts**: Tests for TypeScript enums and interfaces

### Test Utilities
- **test-helpers.ts**: Helper functions for creating test data and common operations

## Test Coverage

The test suite covers:

- ✅ Schema validation
- ✅ Required field validation
- ✅ Data type validation
- ✅ Model operations (CRUD)
- ✅ Enum value validation
- ✅ Integration scenarios
- ✅ Error handling
- ✅ Data consistency

## Database Models

### Cart Model
```typescript
{
  id: string (required),
  owner: string (required),
  cartItems: string[] (required),
  offers: string[] (optional)
}
```

### Order Model
```typescript
{
  id: string (required),
  purchasedItemId: string (required),
  orderStatus: OrderStatus (default: REQUEST),
  time: Date (default: current time)
}
```

## Type Definitions

### Enums
- `Gender`: Male, Female
- `UserType`: ADMIN, MERCHANT, ENDUSER, DRIVER
- `Country`: US, CANADA
- `Tag`: HALAL, KOSHER, VEGEN
- `CartItemType`: EATNOW, EATLATER, ALREADYPAID
- `OrderStatus`: REQUEST, ACCEPT, REJECT, READY, END

### Interfaces
- `AddOn`: element (string), price (number)
- `Size`: size (string), price (number)
- `RuleInterface`: name (string), value (string)

## Development

### Adding New Tests

1. Create test files in the appropriate directory:
   - Model tests: `src/test/models/`
   - Integration tests: `src/test/integration/`
   - Type tests: `src/test/types/`

2. Use the test helper utilities in `src/test/utils/test-helpers.ts`

3. Follow the existing test patterns and naming conventions

### Test Naming Conventions

- Test files: `*.test.ts` or `*.spec.ts`
- Test suites: `describe('Model Name', () => {})`
- Test cases: `it('should do something', () => {})`

### Best Practices

- Use `beforeEach` to set up test data
- Use `afterEach` to clean up test data
- Test both valid and invalid scenarios
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests independent and isolated

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Make sure MongoDB is running and the connection string is correct
2. **Test Timeout**: Increase timeout in `jest.config.js` if tests are taking too long
3. **Type Errors**: Run `npm run build` to check for TypeScript compilation errors

### Debugging Tests

Add `console.log` statements or use Jest's `--verbose` flag:
```bash
npm test -- --verbose
```

## Contributing

1. Write tests for new features
2. Ensure all tests pass before submitting
3. Follow the existing code style and patterns
4. Update this README if needed

