# Conditional Rendering in Dynamic Form Builder

Your form builder now supports **conditional rendering logic** - fields can appear or disappear based on the values of other fields! This creates dynamic, intelligent forms that adapt to user input.

## 🎯 What is Conditional Rendering?

Conditional rendering allows you to show or hide form fields based on specific conditions. For example:
- Show "Phone Number" field only when "Contact Method" is set to "Phone"
- Display "Company Details" only when "Has Company" is checked
- Show "Urgent Reason" only when "Priority" is set to "Urgent"

## 🏗️ How It Works

### **1. Conditional Rule Structure**
```json
{
  "conditional": {
    "field": "dependentFieldId",    // Which field to check
    "operator": "equals",           // Comparison operator
    "value": "expectedValue",       // Value to compare against
    "action": "show"                // Action: "show" or "hide"
  }
}
```

### **2. Field Types**

#### **Single Checkbox (Agreement/Terms)**
```json
{
  "id": "terms",
  "type": "checkbox",
  "label": "I agree to the Terms of Service",
  "required": true
}
```

**Features:**
- Shows red label when required and unchecked (error state)
- Includes its own label text
- No options array needed

#### **Checkbox Group (Multiple Options)**
```json
{
  "id": "interests",
  "type": "checkbox_group",
  "label": "Areas of Interest",
  "required": false,
  "options": [
    { "value": "web", "label": "Web Development" },
    { "value": "mobile", "label": "Mobile Development" },
    { "value": "ai", "label": "Artificial Intelligence" }
  ]
}
```

**Key Difference**: 
- `checkbox`: Single checkbox with built-in label (for agreements, terms, etc.)
- `checkbox_group`: Multiple checkboxes with options array (for selections, preferences, etc.)

### **3. Supported Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Field equals exact value | `"value": "phone"` |
| `not_equals` | Field does not equal value | `"value": "email"` |
| `contains` | Field contains value (strings/arrays) | `"value": "admin"` |
| `greater_than` | Numeric field is greater than value | `"value": 18` |
| `less_than` | Numeric field is less than value | `"value": 65` |
| `is_empty` | Field is empty/null/undefined | No value needed |
| `is_not_empty` | Field has a value | No value needed |

### **3. Actions**
- **`"show"`**: Field appears when condition is true
- **`"hide"`**: Field disappears when condition is true

## 📝 Example Configurations

### **Basic Show/Hide Logic**
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

### **Checkbox-Based Conditions**
```json
{
  "id": "companyName",
  "type": "text",
  "label": "Company Name",
  "conditional": {
    "field": "hasCompany",
    "operator": "equals",
    "value": true,
    "action": "show"
  }
}
```

### **Numeric Comparisons**
```json
{
  "id": "parentalConsent",
  "type": "checkbox",
  "label": "Parental Consent Required",
  "conditional": {
    "field": "age",
    "operator": "less_than",
    "value": 18,
    "action": "show"
  }
}
```

### **Empty/NotEmpty Checks**
```json
{
  "id": "alternativeEmail",
  "type": "email",
  "label": "Alternative Email",
  "conditional": {
    "field": "email",
    "operator": "is_empty",
    "action": "show"
  }
}
```

## 🚀 Advanced Examples

### **Contact Method Example**
```json
{
  "fields": [
    {
      "id": "contactType",
      "type": "radio",
      "label": "Preferred Contact Method",
      "required": true,
      "options": [
        { "value": "phone", "label": "Phone Call" },
        { "value": "email", "label": "Email" },
        { "value": "sms", "label": "SMS" }
      ]
    },
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
    },
    {
      "id": "smsEnabled",
      "type": "checkbox",
      "label": "Enable SMS notifications",
      "conditional": {
        "field": "contactType",
        "operator": "equals",
        "value": "sms",
        "action": "show"
      }
    }
  ]
}
```

### **Student Information Example**
```json
{
  "fields": [
    {
      "id": "isStudent",
      "type": "checkbox",
      "label": "Are you a student?"
    },
    {
      "id": "university",
      "type": "text",
      "label": "University Name",
      "conditional": {
        "field": "isStudent",
        "operator": "equals",
        "value": true,
        "action": "show"
      }
    },
    {
      "id": "graduationYear",
      "type": "number",
      "label": "Graduation Year",
      "conditional": {
        "field": "isStudent",
        "operator": "equals",
        "value": true,
        "action": "show"
      }
    }
  ]
}
```

## ⚡ Performance & Behavior

### **Real-Time Updates**
- Fields appear/disappear **immediately** when conditions change
- No page refresh needed
- Smooth transitions and animations

### **Form Validation**
- Hidden fields are **not validated** (prevents submission errors)
- Required fields that are hidden don't block form submission
- Validation rules still apply to visible fields

### **State Management**
- Hidden field values are **preserved** in form state
- Values are restored when fields become visible again
- No data loss during conditional rendering

## 🔧 Best Practices

### **1. Logical Flow**
- Place controlling fields **before** dependent fields
- Use clear, descriptive field IDs
- Group related conditional fields together

### **2. User Experience**
- Don't hide too many fields at once
- Provide clear labels for controlling fields
- Consider using help text to explain conditions

### **3. Performance**
- Avoid deeply nested conditional logic
- Keep conditions simple and readable
- Test with various data scenarios

## 🧪 Testing Your Conditional Logic

### **1. Load the Sample Form**
Click "Load Sample" to see a working example with multiple conditional fields.

### **2. Test Different Scenarios**
- Try different radio button selections
- Check/uncheck various checkboxes
- Enter different values in controlling fields

### **3. Verify Behavior**
- Fields should appear/disappear smoothly
- Form validation should work correctly
- Hidden fields shouldn't block submission

## 🚀 Future Enhancements

### **Phase 2: Advanced Conditions**
- Multiple conditions (AND/OR logic)
- Field dependencies (show field A when field B AND field C are true)
- Custom validation functions

### **Phase 3: Dynamic Validation**
- Conditional required fields
- Dynamic validation rules
- Field-specific error messages

### **Phase 4: Complex Logic**
- Mathematical expressions
- Date-based conditions
- Array-based conditions

## 💡 Tips & Tricks

1. **Start Simple**: Begin with basic equals/not_equals conditions
2. **Test Thoroughly**: Verify all possible combinations work
3. **Document Logic**: Keep your conditional rules well-documented
4. **User Feedback**: Consider adding visual cues for hidden fields
5. **Accessibility**: Ensure screen readers can handle dynamic content

---

**🎉 Congratulations!** Your form builder now supports intelligent, dynamic forms that adapt to user input. Start building forms that feel alive and responsive!
