# React Form Builder

A dynamic and intuitive drag-and-drop form builder built with React, offering a seamless experience for creating custom forms with various field types and property customizations.

---

## ✨ Features

* **Drag & Drop Interface:** Easily reorder form fields on the canvas using drag-and-drop functionality.
* **Diverse Field Types:** Support for common input types including:
    * Text Input (`text`)
    * Text Area (`textarea`)
    * Dropdown (`dropdown`)
    * Checkboxes (`checkbox`)
    * Radio Buttons (`radio`)
    * Date Picker (`date`)
    * Email Input (`email`)
    * Phone Number Input (`phone`)
* **Field Customization:** Select any field on the canvas to open a properties panel, allowing you to customize:
    * **Label:** The visible name of the field.
    * **Placeholder:** Hint text for input fields.
    * **Required:** Mark fields as mandatory.
    * **Help Text:** Provide additional guidance to users.
    * **Min/Max Length:** (For text, textarea) Set character limits.
    * **Pattern (Regex):** (For email, phone, text) Define custom validation rules using regular expressions.
* **Option Management:** Add, edit, and remove options for `dropdown`, `checkbox`, and `radio` field types.
* **Real-time Updates:** See your form design change instantly as you customize fields.

---

## 🛠️ Technologies Used

* **React.js:** A JavaScript library for building user interfaces.
* **React DnD:** A powerful drag-and-drop utility for React applications.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development and responsiveness.
* **Vite:** A fast build tool for modern web projects (assuming you used a modern setup like Create React App or Vite).

---

## 🚀 Getting Started

Follow these steps to get a local copy of the project up and running on your machine.

### Prerequisites

Make sure you have the following installed:

* Node.js (LTS version recommended)
* npm (comes with Node.js) or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nikhil31082005/Form-builder-app.git
    cd FormBuilderApp # Navigate into your project directory
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will start the development server, usually at `http://localhost:5173` (or another port). Open this URL in your browser to see the form builder.

### Building for Production

To create an optimized production build of your application:

```bash
npm run build
# or
yarn build