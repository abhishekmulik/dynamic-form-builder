import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from '../../../../store/slices/formBuilderSlice';
import { DynamicForm, FormConfig } from '../DynamicForm';

// Test store setup
const createTestStore = () => {
  return configureStore({
    reducer: {
      formBuilder: formBuilderReducer
    }
  });
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

// Simple form configuration for testing
const simpleFormConfig: FormConfig = {
  formTitle: 'Simple Test Form',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: 'Enter your name'
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      required: false,
      validation: {
        min: 18,
        max: 100
      }
    }
  ]
};

const conditionalFormConfig: FormConfig = {
  formTitle: 'Conditional Test Form',
  fields: [
    {
      id: 'businessName',
      type: 'text',
      label: 'Business Name',
      required: true,
      placeholder: 'Enter business name',
      conditional: {
        field: 'userType',
        operator: 'equals',
        value: 'business',
        action: 'show'
      }
    },
    {
      id: 'individualName',
      type: 'text',
      label: 'Individual Name',
      required: true,
      placeholder: 'Enter individual name',
      conditional: {
        field: 'userType',
        operator: 'equals',
        value: 'individual',
        action: 'show'
      }
    },
    {
      id: 'hasEmployees',
      type: 'checkbox',
      label: 'Do you have employees?',
      required: false,
      conditional: {
        field: 'userType',
        operator: 'equals',
        value: 'business',
        action: 'show'
      }
    },
    {
      id: 'employeeCount',
      type: 'number',
      label: 'Number of Employees',
      required: true,
      validation: {
        min: 1,
        max: 1000
      },
      conditional: {
        field: 'hasEmployees',
        operator: 'equals',
        value: true,
        action: 'show'
      }
    }
  ]
};

describe('DynamicForm', () => {
  it('should render form title when provided', () => {
    render(
      <TestWrapper>
        <DynamicForm config={simpleFormConfig} />
      </TestWrapper>
    );

    expect(screen.getByText('Simple Test Form')).toBeInTheDocument();
  });
  it('should handle empty form configuration gracefully', () => {
    const emptyConfig: FormConfig = {
      fields: []
    };

    render(
      <TestWrapper>
        <DynamicForm config={emptyConfig} />
      </TestWrapper>
    );

    expect(screen.getByText('No form configuration provided')).toBeInTheDocument();
  });
  describe('Fields Rendering', () => {
    it('should render all form fields', () => {
      render(
        <TestWrapper>
          <DynamicForm config={simpleFormConfig} />
        </TestWrapper>
      );
      // expect(screen.getByText('Simple Test Form')).toBeInTheDocument();
      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
    })
  }),
    describe('Field Types and Rendering', () => {
      it('should render text input fields correctly', () => {
        render(
          <TestWrapper>
            <DynamicForm config={simpleFormConfig} />
          </TestWrapper>
        );
        const nameField = screen.getByTestId('name');
        expect(nameField).toHaveAttribute('type', 'text');
      });

      it('should render number input fields correctly', () => {
        render(
          <TestWrapper>
            <DynamicForm config={simpleFormConfig} />
          </TestWrapper>
        );

        const ageField = screen.getByTestId('age');
        expect(ageField).toHaveAttribute('type', 'number');
      });
    });
});
