const fs = require('fs');
const path = require('path');

// Directory containing the UI components
const uiDir = path.join(__dirname, 'components', 'ui');

// Function to remove version numbers from import statements
function removeVersionsFromImports(content) {
  // Pattern to match version numbers in imports
  const versionPattern = /@\d+\.\d+\.\d+|@\^\d+\.\d+\.\d+|@~\d+\.\d+\.\d+|@latest|@next/g;
  
  return content.replace(versionPattern, '');
}

// Function to process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = removeVersionsFromImports(content);
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated: ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function to process all files
function main() {
  try {
    const files = fs.readdirSync(uiDir);
    let updatedCount = 0;
    
    files.forEach(file => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const filePath = path.join(uiDir, file);
        if (processFile(filePath)) {
          updatedCount++;
        }
      }
    });
    
    console.log(`\nProcessing complete! Updated ${updatedCount} files.`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();