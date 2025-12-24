# EHR Pipeline - Summarizer Self-Service Portal

A React-based self-service portal for creating and managing EHR summarizers. This application allows operations teams to create complete, functional summarizers without technical team intervention for standard use cases.

## Features

- **Self-Service Summarizer Creation**: Create summarizers with integrated EHR data source configuration
- **Multi-EHR Support**: Configure resources for ECW, AthenaOne, AthenaFlow, AdvancedMD, Charm, DrChrono, and Greenway
- **Flexible Data Sources**: Support for EHR pull, file upload, and text input
- **Variable Extraction**: Define variables with section import or LLM query extraction
- **Template Management**: Configure templates and map summarizers to template sections
- **Advanced Settings**: Configure pipeline dependencies and intermediate file creation
- **EHR-Specific Prompts**: Manage default prompts per EHR and document type

## Tech Stack

- React 18.3.1
- Vite 6.0.1
- Tailwind CSS (via Vite)
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd EHR_pipline
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
EHR_pipline/
├── App.jsx                 # Main application component
├── src/
│   ├── config/
│   │   ├── ehrResources.js      # EHR resource configurations
│   │   ├── resourceSections.js  # Resource section definitions
│   │   └── templateHierarchy.js # Template hierarchy structure
│   ├── utils/
│   │   └── dateHelpers.js       # Date utility functions
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── package.json
└── vite.config.js
```

## Key Components

### Summarizer Creation Flow

1. **Basic Information**: Name, purpose, and doctor selection
2. **Functionality Settings**: Select input types (EHR, Upload, Text)
3. **Data Source Configuration**: Configure EHR resources and filters
4. **Variables**: Define variables for data extraction
5. **Prompt Configuration**: Set up prompts for each input type
6. **Model Selection**: Choose primary and fallback models
7. **Review & Submit**: Review configuration and create summarizer

### Advanced Features

- **Advanced Settings**: Pipeline dependencies and intermediate file creation
- **EHR-Specific Prompts**: Manage default prompts per EHR/document type combination
- **Template Mapping**: Map summarizers to template sections
- **Activate/Deactivate**: Control summarizer lifecycle

## Configuration

EHR resources and filters are configured in `src/config/ehrResources.js`. Each EHR system has:
- Document types
- Available filters (editable and advanced)
- Default filter values
- Pipeline configuration

## License

Private - Internal use only

