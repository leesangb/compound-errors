# Compound Errors

A TypeScript utility that enables type-safe error handling by attaching error classes to functions and class methods at both compile-time and runtime.

## Why Compound Errors?

In traditional JavaScript/TypeScript error handling, you often encounter these problems:

1. **Unclear error types**: Functions can throw various errors, but there's no clear indication of what errors to expect
2. **Runtime surprises**: You might miss handling certain error cases because they're not explicitly documented
3. **Poor developer experience**: No autocomplete or type checking for error handling

Compound Errors solves these issues by:

- **Explicit error declaration**: Clearly define what errors a function/method can throw
- **Type safety**: Get compile-time checking and autocomplete for error handling
- **Runtime access**: Access error constructors directly from the function/method for consistent error throwing and handling

## Installation

```bash
npm install compound-errors
# or
pnpm add compound-errors
# or
yarn add compound-errors
```

## Usage

### Function Error Annotation

Annotate standalone functions with their possible errors:

```typescript
import { withErrors } from 'compound-errors';

// Define custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Annotate function with possible errors
const fetchUserData = withErrors(
  async (userId: string) => {
    if (!userId) {
      throw new fetchUserData.ValidationError('User ID is required');
    }
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    } catch {
      throw new fetchUserData.NetworkError('Failed to fetch user data');
    }
  },
  {
    ValidationError,
    NetworkError,
  }
);

// Usage with type-safe error handling
try {
  const user = await fetchUserData('123');
} catch (error) {
  if (error instanceof fetchUserData.ValidationError) {
    // Handle validation error - TypeScript knows this is ValidationError
    console.error('Validation failed:', error.message);
  } else if (error instanceof fetchUserData.NetworkError) {
    // Handle network error - TypeScript knows this is NetworkError
    console.error('Network error:', error.message);
  }
}
```

### Class Method Error Annotation

Annotate class methods with their possible errors:

```typescript
import { withErrors } from 'compound-errors';

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

class UserService {
  async login(username: string, password: string) {
    // Login implementation
  }
  
  async createUser(userData: object) {
    // Create user implementation
  }
  
  async deleteUser(userId: string) {
    // Delete user implementation
  }
}

// Annotate class with method-specific errors
const TypedUserService = withErrors(UserService, {
  login: {
    AuthenticationError,
    DatabaseError,
  },
  createUser: {
    ValidationError,
    DatabaseError,
  },
  deleteUser: {
    DatabaseError,
  },
});

// Usage
const userService = new TypedUserService();

try {
  await userService.login('john', 'password123');
} catch (error) {
  if (error instanceof userService.login.AuthenticationError) {
    // Handle authentication error
    console.error('Login failed:', error.message);
  } else if (error instanceof userService.login.DatabaseError) {
    // Handle database error
    console.error('Database error during login:', error.message);
  }
}
```

```typescript
import { withErrors } from 'compound-errors';

const UserService = withErrors(class UserService {
  login(username: string, password: string) {
    // Login implementation
    throw new AuthenticationError('Invalid username or password');
    // ...
  }
  createUser(userData: object) {
    // Create user implementation
  }
  deleteUser(userId: string) {
    // Delete user implementation
  }
}, {
  login: {
    AuthenticationError,
    DatabaseError,
  },
});
```

## Benefits

### 1. **Type Safety**
Get compile-time checking and IntelliSense support for error handling:

```typescript
// TypeScript will suggest available error types
if (error instanceof fetchUserData.ValidationError) {
  // ✅ TypeScript knows this is ValidationError
}

// TypeScript will warn about typos
if (error instanceof fetchUserData.ValidatonError) {
  // ❌ TypeScript error: Property 'ValidatonError' does not exist
}
```

### 2. **Self-Documenting Code**
Functions and methods clearly declare what errors they can throw:

```typescript
// Just by looking at the function signature, you know what errors to expect
const processPayment = withErrors(originalFunction, {
  PaymentError,
  ValidationError,
  NetworkError,
});
```

### 3. **Consistent Error Handling**
Access error constructors directly from the function for consistent error creation:

```typescript
// Always use the attached error classes
throw new processPayment.PaymentError('Insufficient funds');

// Rather than creating errors separately
throw new PaymentError('Insufficient funds'); // Less clear relationship
```

### 4. **Better Developer Experience**
- Autocomplete for available error types
- Clear error hierarchy and relationships
- Reduced runtime surprises

## API Reference

### `withErrors(fn, errors)`

Annotates a function with error types.

**Parameters:**
- `fn`: The function to annotate
- `errors`: Object mapping error names to error constructor classes

**Returns:** The original function with error constructors attached as properties

### `withErrors(BaseClass, errorConfig)`

Annotates a class with method-specific error types.

**Parameters:**
- `BaseClass`: The class constructor to annotate
- `errorConfig`: Object mapping method names to their error configurations

**Returns:** The original class with error constructors attached to method properties

## TypeScript Support

This library is built with TypeScript and provides full type safety. The error annotations are preserved in the type system, enabling:

- Compile-time error checking
- IntelliSense and autocomplete
- Type-safe error handling patterns

## License

MIT
