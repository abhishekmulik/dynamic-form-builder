# Dynamic Form Builder - Implementation Guide

A React-based form builder that creates dynamic, conditional forms from JSON configuration.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## 📝 Form Configuration Structure

### Required Fields
```json
{
  "title": "Form Title",
  "fields": [
    // Array of field objects
  ]
}
```

### Field Properties

#### **Required Properties**
- `id`: Unique identifier (string)
- `type`: Field type (see supported types below)
- `label`: Display label (string)

#### **Optional Properties**
- `required`: Boolean (default: false)
- `placeholder`: Input placeholder text
- `helpText`: Helper text below field
- `defaultValue`: Initial field value
- `conditional`: Conditional rendering rules

## 🎯 Supported Field Types

### **Text Inputs**
```json
{
  "id": "firstName",
  "type": "text",
  "label": "First Name",
  "required": true,
  "placeholder": "Enter your first name"
}
```

### **Email**
```json
{
  "id": "email",
  "type": "email",
  "label": "Email Address",
  "required": true
}
```

### **Number**
```json
{
  "id": "age",
  "type": "number",
  "label": "Age",
  "min": 0,
  "max": 120
}
```

### **Textarea**
```json
{
  "id": "bio",
  "type": "textarea",
  "label": "Biography",
  "rows": 4
}
```

### **Select Dropdown**
```json
{
  "id": "country",
  "type": "select",
  "label": "Country",
  "required": true,
  "options": [
    { "value": "us", "label": "United States" },
    { "value": "ca", "label": "Canada" },
    { "value": "uk", "label": "United Kingdom" }
  ]
}
```

### **Radio Buttons**
```json
{
  "id": "gender",
  "type": "radio",
  "label": "Gender",
  "required": true,
  "options": [
    { "value": "male", "label": "Male" },
    { "value": "female", "label": "Female" },
    { "value": "other", "label": "Other" }
  ]
}
```

### **Checkbox Group**
```json
{
  "id": "interests",
  "type": "checkbox_group",
  "label": "Areas of Interest",
  "options": [
    { "value": "web", "label": "Web Development" },
    { "value": "mobile", "label": "Mobile Development" },
    { "value": "ai", "label": "Artificial Intelligence" }
  ]
}
```

### **Single Checkbox**
```json
{
  "id": "terms",
  "type": "checkbox",
  "label": "I agree to the Terms of Service",
  "required": true
}
```

### **Phone Number**
```json
{
  "id": "phone",
  "type": "tel",
  "label": "Phone Number",
  "placeholder": "(555) 123-4567"
}
```

## 🔀 Conditional Rendering

### Basic Structure
```json
{
  "conditional": {
    "field": "dependentFieldId",
    "operator": "equals",
    "value": "expectedValue",
    "action": "show"
  }
}
```

### Supported Operators
- `equals`, `not_equals`
- `contains`, `greater_than`, `less_than`
- `is_empty`, `is_not_empty`

### Example
```json
{
  "id": "phone",
  "type": "tel",
  "label": "Phone Number",
  "conditional": {
    "field": "contactType",
    "operator": "equals",
    "value": "phone",
    "action": "show"
  }
}
```

## 📊 Complete Form Example

```json
{
  "formTitle": "Job Application Form",
  "fields": [
    {
      "id": "position",
      "type": "select",
      "label": "Position Applied For",
      "required": true,
      "placeholder": "Select a position",
      "options": [
        { "value": "frontend-developer", "label": "Frontend Developer" },
        { "value": "backend-developer", "label": "Backend Developer" },
        { "value": "fullstack-developer", "label": "Full Stack Developer" }
      ]
    },
    {
      "id": "firstName",
      "type": "text",
      "label": "First Name",
      "required": true,
      "placeholder": "Enter your first name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "Enter your email address"
    },
    {
      "id": "experience",
      "type": "radio",
      "label": "Years of Experience",
      "required": true,
      "options": [
        { "value": "0-1", "label": "0-1 years" },
        { "value": "2-3", "label": "2-3 years" },
        { "value": "4-6", "label": "4-6 years" }
      ]
    },
    {
      "id": "hasPortfolio",
      "type": "checkbox",
      "label": "Do you have a portfolio or GitHub profile?",
      "required": false
    },
    {
      "id": "portfolioUrl",
      "type": "text",
      "label": "Portfolio/GitHub URL",
      "required": false,
      "placeholder": "Enter your portfolio or GitHub URL",
      "conditional": {
        "field": "hasPortfolio",
        "operator": "equals",
        "value": true,
        "action": "show"
      }
    },
    {
      "id": "coverLetter",
      "type": "textarea",
      "label": "Cover Letter",
      "required": false,
      "placeholder": "Tell us why you're interested in this position..."
    },
    {
      "id": "terms",
      "type": "checkbox",
      "label": "I agree to the terms and conditions of this application",
      "required": true
    }
  ]
}
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

## 🎨 Customization

### Theme Colors
Edit `src/theme/color.ts` to customize:
- Primary colors
- Error states
- Success states
- Background colors

### Component Styling
All components use Chakra UI and can be customized through:
- Theme overrides
- Component props
- CSS custom properties

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── formBuilder/    # Form building interface
│   ├── ui/            # Reusable UI components
│   └── ...
├── store/              # Redux store and slices
├── theme/              # Theme configuration
├── types/              # TypeScript type definitions
└── utils/              # Utility functions.
```
