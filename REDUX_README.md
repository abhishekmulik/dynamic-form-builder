# Redux State Management Implementation

This project now uses Redux Toolkit for state management, providing a clean and predictable way to manage application state.

## Folder Structure

```
src/
├── store/
│   ├── index.ts          # Main store configuration
│   ├── hooks.ts          # Typed Redux hooks
│   └── slices/
│       └── formBuilderSlice.ts  # Form builder state slice
├── data/
│   └── sampleFormConfig.json    # Sample form configuration
└── components/
    ├── FormConfigEditor.tsx     # Uses Redux for state
    └── LivePreview.tsx          # Displays Redux state
```

## State Structure

The main state is managed in the `formBuilderSlice` with the following structure:

```typescript
interface FormBuilderState {
  jsonInput: string;        // Raw JSON input from user
  error: string;            // Validation errors
  parsedFormData: any;      // Successfully parsed form data
  isLoading: boolean;       // Loading state for future use
}
```

## Available Actions

- `setJsonInput(value: string)` - Updates the JSON input
- `setError(error: string)` - Sets validation errors
- `setParsedFormData(data: any)` - Sets successfully parsed form data
- `setLoading(loading: boolean)` - Sets loading state
- `clearConfiguration()` - Clears JSON data
- `clearForm()` - Clears Form data

## Usage in Components

### Using Redux State
```typescript
import { useAppSelector } from '../store/hooks';

function MyComponent() {
  const { jsonInput, error, parsedFormData } = useAppSelector(
    (state) => state.formBuilder
  );
  // ... component logic
}
```

### Dispatching Actions
```typescript
import { useAppDispatch } from '../store/hooks';
import { setJsonInput, setError } from '../store/slices/formBuilderSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  const handleInputChange = (value: string) => {
    dispatch(setJsonInput(value));
  };
  
  const handleError = (error: string) => {
    dispatch(setError(error));
  };
}
```

## Benefits of This Implementation

1. **Centralized State**: All form-related state is managed in one place
2. **Predictable Updates**: State changes follow a clear pattern through actions
3. **Type Safety**: Full TypeScript support with typed actions and state
4. **Easy Testing**: Actions and reducers can be easily unit tested
5. **Scalable**: Easy to add new slices and features as the app grows
6. **DevTools**: Redux DevTools support for debugging

## Testing the Implementation

1. Start the development server: `npm start`
2. Click "Load Sample" to see a pre-configured form
3. Modify the JSON in the editor to see real-time updates
4. Try invalid JSON to see error handling
5. Use the Clear button to reset the state

## Future Enhancements

- Add more slices for different features (themes, user preferences, etc.)
- Implement async actions for API calls
- Add persistence layer for form configurations
- Implement undo/redo functionality
