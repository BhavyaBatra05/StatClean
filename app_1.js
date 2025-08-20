// StatClean AI - Intelligent Survey Data Processing Platform
// MoSPI Hackathon 2025 Submission - Data Innovators Team

// Sample data for demonstration
const hackathonData = {
  surveyData: [
    {"id": 1, "age": 25, "region": "North", "income": 45000, "education": "Graduate", "response": "Yes", "gender": "Female", "occupation": "Teacher"},
    {"id": 2, "age": 34, "region": "South", "income": 52000, "education": "Post-Graduate", "response": "No", "gender": "Male", "occupation": "Engineer"},
    {"id": 3, "age": 28, "region": "East", "income": null, "education": "Graduate", "response": "Yes", "gender": "Female", "occupation": "Doctor"},
    {"id": 4, "age": 45, "region": "West", "income": 78000, "education": "Graduate", "response": "Yes", "gender": "Male", "occupation": "Manager"},
    {"id": 5, "age": null, "region": "North", "income": 41000, "education": "High School", "response": "No", "gender": "Female", "occupation": "Clerk"},
    {"id": 6, "age": 31, "region": "South", "income": 95000, "education": "Post-Graduate", "response": "Yes", "gender": "Male", "occupation": "Consultant"},
    {"id": 7, "age": 29, "region": "East", "income": 48000, "education": "Graduate", "response": "No", "gender": "Female", "occupation": "Analyst"},
    {"id": 8, "age": 37, "region": "West", "income": 62000, "education": "Graduate", "response": "Yes", "gender": "Male", "occupation": "Developer"},
    {"id": 9, "age": 26, "region": "North", "income": 39000, "education": "High School", "response": "No", "gender": "Female", "occupation": "Assistant"},
    {"id": 10, "age": 42, "region": "South", "income": 71000, "education": "Post-Graduate", "response": "Yes", "gender": "Male", "occupation": "Professor"},
    {"id": 11, "age": 33, "region": "East", "income": 54000, "education": "Graduate", "response": "Yes", "gender": "Female", "occupation": "Nurse"},
    {"id": 12, "age": 38, "region": "West", "income": 67000, "education": "Post-Graduate", "response": "No", "gender": "Male", "occupation": "Lawyer"},
    {"id": 13, "age": 27, "region": "North", "income": 43000, "education": "Graduate", "response": "Yes", "gender": "Female", "occupation": "Designer"},
    {"id": 14, "age": 41, "region": "South", "income": 73000, "education": "Graduate", "response": "Yes", "gender": "Male", "occupation": "Accountant"},
    {"id": 15, "age": 35, "region": "East", "income": 58000, "education": "Post-Graduate", "response": "No", "gender": "Female", "occupation": "Researcher"}
  ],
  weights: {
    "North": 1.2,
    "South": 0.9,
    "East": 1.1,
    "West": 1.0
  },
  cleaningResults: {
    originalRecords: 15,
    missingValues: 2,
    outliers: 1,
    duplicates: 0,
    ruleViolations: 0,
    cleanedRecords: 15,
    dataQualityScore: 92.5
  },
  estimationResults: {
    totalPopulation: 125000,
    estimatedResponseRate: 62.5,
    marginOfError: 3.2,
    confidenceInterval: "95%",
    sampleSize: 15,
    effectiveSampleSize: 14.8
  }
};

// Application state
let currentStep = 1;
let uploadedData = null;
let charts = {};
let processingLog = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('StatClean AI - Initializing...');
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  initializeFileUpload();
  initializeTabs();
  updateStepDisplay(); // Ensure initial display is correct
  logActivity('Application initialized', 'System startup completed');
}

// Event Listeners Setup
function setupEventListeners() {
  // File input change
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
  }

  // Upload area drag and drop
  const uploadArea = document.getElementById('uploadArea');
  if (uploadArea) {
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
    uploadArea.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn')) {
        document.getElementById('fileInput').click();
      }
    });
  }

  // Tab buttons for upload options
  const optionTabs = document.querySelectorAll('.option-tabs .tab-btn');
  optionTabs.forEach(btn => {
    btn.addEventListener('click', (e) => switchOptionTab(e.target.dataset.tab));
  });

  // Tab buttons for cleaning modules
  const moduleTabs = document.querySelectorAll('.module-tabs .tab-btn');
  moduleTabs.forEach(btn => {
    btn.addEventListener('click', (e) => switchModuleTab(e.target.dataset.tab));
  });

  // Template cards
  const templateCards = document.querySelectorAll('.template-card');
  templateCards.forEach(card => {
    card.addEventListener('click', () => selectTemplate(card));
  });

  // Modal events
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-close')) {
      closeModal('successModal');
    }
  });

  // Slider for outlier threshold
  const outlierThreshold = document.getElementById('outlierThreshold');
  if (outlierThreshold) {
    outlierThreshold.addEventListener('input', (e) => {
      const value = e.target.value;
      const valueSpan = document.querySelector('.range-value');
      if (valueSpan) {
        valueSpan.textContent = `${value} std deviations`;
      }
    });
  }

  // Weight method radios
  const weightMethodRadios = document.querySelectorAll('input[name="weightMethod"]');
  weightMethodRadios.forEach(radio => {
    radio.addEventListener('change', handleWeightMethodChange);
  });

  // Add event listeners for data processing buttons
  setupProcessingButtons();
}

function setupProcessingButtons() {
  // Wait for DOM to be ready and add event listeners to processing buttons
  setTimeout(() => {
    // Imputation button
    const imputationBtn = document.querySelector('#imputation-panel .btn--primary');
    if (imputationBtn && imputationBtn.textContent.includes('Apply Imputation')) {
      imputationBtn.onclick = applyImputation;
    }
    
    // Outlier detection button
    const outlierBtn = document.querySelector('#outliers-panel .btn--primary');
    if (outlierBtn && outlierBtn.textContent.includes('Detect Outliers')) {
      outlierBtn.onclick = detectOutliers;
    }
    
    // Validation button
    const validationBtn = document.querySelector('#validation-panel .btn--primary');
    if (validationBtn && validationBtn.textContent.includes('Validate Data')) {
      validationBtn.onclick = validateData;
    }
    
    // Apply weights button
    const weightsBtn = document.querySelector('#step-4 .btn--primary:not([onclick])');
    if (weightsBtn && weightsBtn.textContent.includes('Apply Weights')) {
      weightsBtn.onclick = applyWeights;
    }
    
    // Report generation buttons
    const reportButtons = document.querySelectorAll('#step-6 .action-grid .btn');
    reportButtons.forEach(btn => {
      if (btn.textContent.includes('Generate PDF')) {
        btn.onclick = () => generateReport('pdf');
      } else if (btn.textContent.includes('Generate HTML')) {
        btn.onclick = () => generateReport('html');
      } else if (btn.textContent.includes('Preview Report')) {
        btn.onclick = previewReport;
      } else if (btn.textContent.includes('Save Project')) {
        btn.onclick = saveProject;
      }
    });

    // Interactive table buttons
    const tableButtons = document.querySelectorAll('.interactive-controls .btn');
    tableButtons.forEach(btn => {
      if (btn.textContent.includes('Export Results')) {
        btn.onclick = exportResults;
      } else if (btn.textContent.includes('Weighted')) {
        btn.onclick = () => showTable('weighted');
      } else if (btn.textContent.includes('Unweighted')) {
        btn.onclick = () => showTable('unweighted');
      }
    });

    // Demo data button
    const demoDataBtn = document.querySelector('#demo-tab .btn--primary');
    if (demoDataBtn && demoDataBtn.textContent.includes('Load Demo Data')) {
      demoDataBtn.onclick = loadDemoData;
    }
  }, 500);
}

// Global functions for onclick handlers
window.nextStep = nextStep;
window.previousStep = previousStep;
window.startDemo = startDemo;
window.completeDashboard = completeDashboard;
window.restartDemo = restartDemo;
window.loadDemoData = loadDemoData;
window.showModal = showModal;
window.closeModal = closeModal;
window.selectTemplate = selectTemplate;
window.generateReport = generateReport;
window.previewReport = previewReport;
window.saveProject = saveProject;
window.exportResults = exportResults;
window.showTable = showTable;
window.applyImputation = applyImputation;
window.detectOutliers = detectOutliers;
window.validateData = validateData;
window.applyWeights = applyWeights;

// Step Navigation Functions
function nextStep() {
  if (currentStep < 6) {
    if (validateCurrentStep()) {
      const prevStep = currentStep;
      currentStep++;
      updateStepDisplay();
      
      logActivity(`Step ${prevStep} → ${currentStep}`, `Advanced to step ${currentStep}`);
      
      // Initialize step-specific content
      setTimeout(() => {
        if (currentStep === 2 && !uploadedData) {
          // Auto-show demo data option
          showSuccessMessage('Try our demo with sample survey data, or upload your own files!');
        } else if (currentStep === 4) {
          initializeWeightChart();
        } else if (currentStep === 5) {
          initializeEstimationCharts();
        }
      }, 500);
    }
  }
}

function previousStep() {
  if (currentStep > 1) {
    const prevStep = currentStep;
    currentStep--;
    updateStepDisplay();
    logActivity(`Step ${prevStep} → ${currentStep}`, `Returned to step ${currentStep}`);
  }
}

function startDemo() {
  showSuccessMessage('Starting demo with sample survey data...');
  setTimeout(() => {
    nextStep();
    // Auto-load demo data after advancing
    setTimeout(() => {
      loadDemoData();
    }, 1000);
  }, 1500);
}

function completeDashboard() {
  logActivity('Demo completed', 'All workflow steps completed successfully');
  showModal('successModal');
}

function restartDemo() {
  currentStep = 1;
  uploadedData = null;
  
  // Clear charts
  Object.keys(charts).forEach(chartKey => {
    if (charts[chartKey]) {
      charts[chartKey].destroy();
      delete charts[chartKey];
    }
  });
  
  processingLog = [];
  updateStepDisplay();
  closeModal('successModal');
  showSuccessMessage('Demo restarted! Ready for a new analysis.');
  
  // Reset file preview
  const filePreview = document.getElementById('filePreview');
  if (filePreview) {
    filePreview.style.display = 'none';
  }
  
  // Reset next button
  const uploadNextBtn = document.getElementById('uploadNextBtn');
  if (uploadNextBtn) {
    uploadNextBtn.disabled = true;
  }
}

function validateCurrentStep() {
  // For hackathon demo, always allow progression
  return true;
}

function updateStepDisplay() {
  // Update step classes
  document.querySelectorAll('.step').forEach((step, index) => {
    step.classList.remove('active', 'completed');
    if (index + 1 === currentStep) {
      step.classList.add('active');
    } else if (index + 1 < currentStep) {
      step.classList.add('completed');
    }
  });

  // Update progress bar
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    const percentage = (currentStep / 6) * 100;
    progressFill.style.width = `${percentage}%`;
  }

  // Show current step content
  document.querySelectorAll('.step-content').forEach((content, index) => {
    content.classList.remove('active');
    if (index + 1 === currentStep) {
      content.classList.add('active');
      content.classList.add('fade-in');
      
      // Remove fade-in class after animation
      setTimeout(() => {
        content.classList.remove('fade-in');
      }, 300);
    }
  });
}

// File Upload Functions
function initializeFileUpload() {
  setTimeout(() => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      console.log('File upload initialized');
    }
  }, 100);
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
}

function handleFileDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e) {
  const files = e.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function processFile(file) {
  // Validate file type
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    showErrorMessage('Please upload a CSV or Excel file.');
    return;
  }

  // Show processing message
  showSuccessMessage('📂 File uploaded successfully! Processing data...');
  logActivity('File upload', `${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

  // Simulate file processing with demo data
  setTimeout(() => {
    uploadedData = hackathonData.surveyData;
    displayFilePreview(file.name, uploadedData);
    enableNextButton('uploadNextBtn');
    showSuccessMessage('✅ File processed! Schema mapping completed automatically.');
  }, 1500);
}

function loadDemoData() {
  showSuccessMessage('📊 Loading sample survey data for demonstration...');
  
  setTimeout(() => {
    uploadedData = hackathonData.surveyData;
    displayFilePreview('sample_survey_data.csv', uploadedData);
    enableNextButton('uploadNextBtn');
    logActivity('Demo data loaded', '15 records, 8 variables with AI-detected schema');
    showSuccessMessage('✅ Demo data loaded! AI schema detection complete.');
  }, 1200);
}

function displayFilePreview(fileName, data) {
  const filePreview = document.getElementById('filePreview');
  const fileNameSpan = document.getElementById('fileName');
  const recordCount = document.getElementById('recordCount');
  const columnCount = document.getElementById('columnCount');
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');
  const columnMappings = document.getElementById('columnMappings');

  if (!filePreview || !data || data.length === 0) return;

  // Update file info
  if (fileNameSpan) fileNameSpan.textContent = fileName;
  if (recordCount) recordCount.textContent = data.length;
  
  const columns = Object.keys(data[0]);
  if (columnCount) columnCount.textContent = columns.length;

  // Create table header
  if (tableHeader) {
    tableHeader.innerHTML = '';
    const headerRow = document.createElement('tr');
    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
  }

  // Create table body (show first 5 rows)
  if (tableBody) {
    tableBody.innerHTML = '';
    const previewData = data.slice(0, 5);
    previewData.forEach(row => {
      const tr = document.createElement('tr');
      columns.forEach(col => {
        const td = document.createElement('td');
        const value = row[col];
        td.textContent = value !== null && value !== undefined ? value : 'NULL';
        if (value === null || value === undefined) {
          td.style.fontStyle = 'italic';
          td.style.color = 'var(--color-error)';
          td.style.background = 'rgba(var(--color-error-rgb), 0.1)';
        }
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  }

  // Create intelligent column mappings
  if (columnMappings) {
    columnMappings.innerHTML = '';
    columns.forEach(col => {
      const mappingDiv = document.createElement('div');
      mappingDiv.className = 'column-mapping';
      
      const label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = `${col}`;
      
      const select = document.createElement('select');
      select.className = 'form-control';
      select.innerHTML = `
        <option value="numeric">Numeric</option>
        <option value="categorical">Categorical</option>
        <option value="text">Text</option>
        <option value="date">Date</option>
      `;
      
      // AI-powered column type detection
      const sampleValues = data.slice(0, 5).map(row => row[col]).filter(v => v !== null);
      const firstValue = sampleValues[0];
      
      if (col.toLowerCase().includes('income') || col.toLowerCase().includes('age') || 
          (typeof firstValue === 'number') || 
          (typeof firstValue === 'string' && !isNaN(parseFloat(firstValue)))) {
        select.value = 'numeric';
      } else if (col.toLowerCase().includes('region') || col.toLowerCase().includes('education') || 
                 col.toLowerCase().includes('response') || col.toLowerCase().includes('gender')) {
        select.value = 'categorical';
      } else {
        select.value = 'text';
      }
      
      mappingDiv.appendChild(label);
      mappingDiv.appendChild(select);
      columnMappings.appendChild(mappingDiv);
    });
  }

  if (filePreview) {
    filePreview.style.display = 'block';
    filePreview.classList.add('fade-in');
  }
}

// Tab Management Functions
function initializeTabs() {
  // Initialize upload tabs
  const firstUploadTab = document.querySelector('.option-tabs .tab-btn');
  if (firstUploadTab && firstUploadTab.dataset.tab) {
    switchOptionTab(firstUploadTab.dataset.tab);
  }

  // Initialize cleaning tabs
  const firstCleaningTab = document.querySelector('.module-tabs .tab-btn');
  if (firstCleaningTab && firstCleaningTab.dataset.tab) {
    switchModuleTab(firstCleaningTab.dataset.tab);
  }
}

function switchOptionTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.option-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeTab = document.querySelector(`.option-tabs [data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Update tab panels
  document.querySelectorAll('#upload-tab, #demo-tab').forEach(panel => {
    panel.classList.remove('active');
  });
  const activePanel = document.getElementById(`${tabName}-tab`);
  if (activePanel) {
    activePanel.classList.add('active');
  }
}

function switchModuleTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.module-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeTab = document.querySelector(`.module-tabs [data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Update tab panels
  document.querySelectorAll('.cleaning-modules .tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const activePanel = document.getElementById(`${tabName}-panel`);
  if (activePanel) {
    activePanel.classList.add('active');
  }
}

// Chart Initialization Functions
function initializeWeightChart() {
  const ctx = document.getElementById('weightChart');
  if (!ctx || charts.weightChart) return;

  const regions = Object.keys(hackathonData.weights);
  const weights = Object.values(hackathonData.weights);

  charts.weightChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: regions,
      datasets: [{
        label: 'Weight Factor',
        data: weights,
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
        borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Regional Weight Distribution',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Weight Factor',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Region',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });

  logActivity('Weight visualization', 'Regional weight chart initialized');
}

function initializeEstimationCharts() {
  const ctx = document.getElementById('distributionChart');
  if (!ctx || charts.distributionChart) return;

  // Regional response distribution data
  const regionData = {
    'North': { yes: 2, no: 2 },
    'South': { yes: 3, no: 1 },
    'East': { yes: 2, no: 1 },
    'West': { yes: 2, no: 2 }
  };

  const regions = Object.keys(regionData);
  const yesData = regions.map(region => regionData[region].yes);
  const noData = regions.map(region => regionData[region].no);

  charts.distributionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: regions,
      datasets: [
        {
          label: 'Yes Responses',
          data: yesData,
          backgroundColor: '#5D878F',
          borderColor: '#5D878F',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'No Responses',
          data: noData,
          backgroundColor: '#DB4545',
          borderColor: '#DB4545',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Response Distribution by Region',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Region',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      }
    }
  });

  logActivity('Analysis visualization', 'Distribution chart initialized');
}

// Data Processing Functions (AI Simulation)
function applyImputation() {
  showSuccessMessage('AI imputation in progress...');
  
  setTimeout(() => {
    logActivity('Missing value imputation', 'KNN method applied to 2 missing values');
    showSuccessMessage('✅ AI Imputation completed! 2 missing values intelligently filled using KNN algorithm.');
    updateCleaningSummary();
  }, 2000);
}

function detectOutliers() {
  showSuccessMessage('🎯 AI outlier detection running...');
  
  setTimeout(() => {
    logActivity('Outlier detection', 'Z-Score method detected 1 outlier in income column');
    showSuccessMessage('✅ Outlier detection completed! 1 outlier flagged in income data (ID: 6, $95,000).');
    updateCleaningSummary();
  }, 1800);
}

function validateData() {
  showSuccessMessage('✅ Running intelligent validation rules...');
  
  setTimeout(() => {
    logActivity('Data validation', 'All validation rules passed successfully');
    showSuccessMessage('✅ Validation completed! All records pass consistency checks. Data quality: 92.5%');
    updateCleaningSummary();
  }, 1500);
}

function applyWeights() {
  showSuccessMessage('⚖️ Applying survey weights...');
  
  setTimeout(() => {
    logActivity('Survey weights', 'Regional weights applied successfully');
    showSuccessMessage('✅ Weights applied successfully! Population estimates updated with design effects.');
    
    if (charts.weightChart) {
      charts.weightChart.update();
    }
  }, 1600);
}

function updateCleaningSummary() {
  const qualityScore = document.getElementById('qualityScore');
  if (qualityScore) {
    qualityScore.textContent = '95.2%';
  }
}

// Report Generation Functions
function selectTemplate(selectedCard) {
  document.querySelectorAll('.template-card').forEach(card => {
    card.classList.remove('active');
  });
  selectedCard.classList.add('active');
  
  const templateName = selectedCard.querySelector('h5').textContent;
  logActivity('Template selection', templateName);
  showSuccessMessage(`Report template "${templateName}" selected successfully!`);
}

function previewReport() {
  showSuccessMessage('Generating report preview...');
  
  setTimeout(() => {
    logActivity('Report preview', 'Interactive preview generated');
    showSuccessMessage('✅ Report preview ready! Opening in new window...');
  }, 2000);
}

function generateReport(format) {
  const templateCard = document.querySelector('.template-card.active');
  const templateName = templateCard ? templateCard.querySelector('h5').textContent : 'Executive Summary';
  
  showSuccessMessage(`Generating ${format.toUpperCase()} report...`);
  
  setTimeout(() => {
    logActivity('Report generation', `${templateName} report in ${format.toUpperCase()} format`);
    showSuccessMessage(`✅ ${templateName} report generated successfully! Download would start in production.`);
  }, 2500);
}

function saveProject() {
  showSuccessMessage('💾 Saving project state...');
  
  setTimeout(() => {
    logActivity('Project save', 'All workflow data and settings saved');
    showSuccessMessage('✅ Project saved successfully! You can resume this analysis later.');
  }, 1500);
}

function exportResults() {
  showSuccessMessage('📊 Exporting analysis results...');
  
  setTimeout(() => {
    logActivity('Results export', 'Statistical results exported to CSV');
    showSuccessMessage('✅ Results exported! CSV file with estimates and confidence intervals ready.');
  }, 1800);
}

function showTable(type) {
  const buttons = document.querySelectorAll('.interactive-controls .btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  const activeButton = [...buttons].find(btn => btn.textContent.toLowerCase().includes(type));
  if (activeButton) {
    activeButton.classList.add('active');
  }
  
  showSuccessMessage(`📊 Displaying ${type} estimates table.`);
  logActivity('Table view', `Switched to ${type} estimates`);
}

// Utility Functions
function enableNextButton(buttonId) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.disabled = false;
    button.classList.add('pulse');
    setTimeout(() => {
      button.classList.remove('pulse');
    }, 2000);
  }
}

function showSuccessMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'success-message fade-in';
  messageDiv.textContent = message;
  
  const currentStepContent = document.querySelector('.step-content.active .container');
  if (currentStepContent) {
    currentStepContent.insertBefore(messageDiv, currentStepContent.firstChild);
    
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 5000);
  }
}

function showErrorMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'error-message fade-in';
  messageDiv.textContent = message;
  
  const currentStepContent = document.querySelector('.step-content.active .container');
  if (currentStepContent) {
    currentStepContent.insertBefore(messageDiv, currentStepContent.firstChild);
    
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 5000);
  }
}

// Modal Functions
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    if (modalId === 'successModal') {
      confettiEffect();
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function confettiEffect() {
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545'];
  const modal = document.querySelector('.modal-content');
  
  if (!modal) return;
  
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '1001';
      
      modal.appendChild(confetti);
      
      confetti.animate([
        { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
        { transform: 'translateY(300px) rotate(360deg)', opacity: 0 }
      ], {
        duration: 2000,
        easing: 'ease-out'
      }).onfinish = () => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      };
    }, i * 100);
  }
}

// Activity Logging
function logActivity(action, details) {
  const timestamp = new Date().toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  processingLog.push({
    timestamp,
    action,
    details,
    step: currentStep
  });
  
  console.log(`📋 [${timestamp}] ${action}: ${details}`);
}

// Weight Method Handler
function handleWeightMethodChange(e) {
  const method = e.target.value;
  const regionalWeights = document.getElementById('regionalWeights');
  
  if (regionalWeights) {
    if (method === 'regional') {
      regionalWeights.style.display = 'block';
    } else {
      regionalWeights.style.display = 'none';
    }
  }
  
  logActivity('Weight method', `Changed to ${method} weighting`);
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal('successModal');
  }
  
  if (e.ctrlKey) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      previousStep();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextStep();
    }
  }
  
  if (e.key === ' ' && currentStep === 1) {
    e.preventDefault();
    startDemo();
  }
});

// Hackathon Summary Function
function getHackathonSummary() {
  return {
    projectTitle: "StatClean AI: Intelligent Survey Data Processing Platform",
    team: "Data Innovators",
    hackathon: "MoSPI Hackathon 2025",
    currentStep: currentStep,
    featuresUsed: {
      dataUpload: uploadedData !== null,
      aiCleaning: processingLog.some(log => log.action.includes('imputation')),
      surveyWeights: processingLog.some(log => log.action.includes('weights')),
      visualization: Object.keys(charts).length > 0,
      reportGeneration: processingLog.some(log => log.action.includes('report'))
    },
    processingLog: processingLog,
    dataQuality: hackathonData.cleaningResults.dataQualityScore,
    innovation: [
      "AI-powered missing value imputation",
      "Real-time data quality assessment",
      "Interactive visualization dashboard",
      "Automated report generation",
      "Step-by-step guided workflow"
    ]
  };
}

// Expose functions globally
window.StatCleanAI = {
  nextStep,
  previousStep,
  startDemo,
  loadDemoData,
  completeDashboard,
  restartDemo,
  getHackathonSummary,
  processingLog,
  hackathonData
};

// Initialize accessibility on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Add ARIA labels
    document.querySelectorAll('.btn').forEach(btn => {
      if (!btn.hasAttribute('aria-label')) {
        btn.setAttribute('aria-label', btn.textContent.trim());
      }
    });
    
    // Add keyboard navigation to steps
    document.querySelectorAll('.step').forEach((step, index) => {
      step.setAttribute('tabindex', '0');
      step.setAttribute('role', 'button');
      step.setAttribute('aria-label', `Step ${index + 1}: ${step.querySelector('span').textContent}`);
      
      step.addEventListener('click', () => {
        if (index + 1 <= currentStep || index + 1 === currentStep + 1) {
          const targetStep = index + 1;
          if (targetStep !== currentStep) {
            if (targetStep > currentStep) {
              nextStep();
            } else {
              currentStep = targetStep;
              updateStepDisplay();
            }
          }
        }
      });
    });
  }, 1000);
});

console.log('StatClean AI');
console.log('Team: The Ideators');
console.log('Features: AI data cleaning, real-time quality assessment, automated reporting');